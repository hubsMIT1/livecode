import express, { Request, Response } from 'express';
import Docker from 'dockerode';
import { Writable } from 'stream';

const app = express();
const docker = new Docker();

app.use(express.json());

interface LogOutput {
  stdout: string;
  stderr: string;
}

interface ExecutionResponse {
  output: string;
  error: string;
  executionTime: string;
  memoryUsage: string;
  cpuUsage: string;
}

// Helper function to stream Docker logs
function streamLogs(container: Docker.Container): Promise<LogOutput> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    container.attach({
      // follow: true,
      stdout: true,
      stderr: true
    }, (err, stream) => {

      if (err) {
        reject(err);
        return;
      }

      container.modem.demuxStream(stream,
        new Writable({
          write: function(chunk: Buffer, encoding: string, next: () => void) {
            stdout += chunk.toString();
            next();
          }
        }),
        new Writable({
          write: function(chunk: Buffer, encoding: string, next: () => void) {
            stderr += chunk.toString();
            next();
          }
        })
      );

      stream?.on('end', () => {
        resolve({ stdout, stderr });
      });
    });
  });
}

app.post('/execute', async (req: Request, res: Response) => {
  const { language, code, input } = req.body;
console.log(req.body)
  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    const startTime = Date.now();

    const container = await docker.createContainer({
      Image: `language-image-${language}`,
      Cmd: ['sh', '-c', `echo "${code}" > /tmp/code.${language} && echo "${input}" > /tmp/input.txt && run-${language} /tmp/code.${language} < /tmp/input.txt`],
      NetworkDisabled: true,
      HostConfig: {
        Memory: 128 * 1024 * 1024, // 128 MB
        MemorySwap: 128 * 1024 * 1024,
        CpuPeriod: 100000,
        CpuQuota: 50000,
      },
    });

    await container.start();

    const logs = await streamLogs(container);
    const stats = await container.stats({ stream: false });
    await container.remove();

    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log(logs)
    const response: ExecutionResponse = {
      output: logs.stdout,
      error: logs.stderr,
      executionTime: `${executionTime}ms`,
      memoryUsage: `${stats.memory_stats.usage / 1024 / 1024} MB`,
      cpuUsage: `${stats.cpu_stats.cpu_usage.total_usage / 1000000}ms`,
    };
    res.json(response);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'An error occurred during code execution' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));