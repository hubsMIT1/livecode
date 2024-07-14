import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ReadProblem: React.FC<{ problem_desc: string; }> = ({problem_desc}) => {
  // const [markdownContent, setMarkdownContent] = useState<string>(problem_des);
  // useEffect(() => {
  //   // Fetch the Markdown file from the public folder
  //   fetch('/problems/two-sum.md')
  //     .then((response) => response.text())
  //     .then((text) => {
  //       setMarkdownContent(text);
  //       // console.log(text)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching Markdown file:', error);
  //     });
  // }, []);
  // if repo is private 
  // const response = await axios.get(
  //   'https://api.github.com/repos/username/repo/contents/path/to/file.md',
  //   {
  //     headers: {
  //       Authorization: `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`,
  //     },
  //   }
  // );
  // const content = atob(response.data.content); // Decode base64 content

  return (
    <section className='code_section bg-gray-50 dark:bg-gray-900'>
      <Markdown
        remarkPlugins={[remarkGfm]}
      >
        {problem_desc}
      </Markdown>
    </section>
  );
};

export default ReadProblem;