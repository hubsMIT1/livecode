import { Schedule } from "@prisma/client";
import { prisma } from "../../utils/dbsetup";

export const getRoomById = async (id: string): Promise<Schedule | { error: string } | null> => {
    let result;
    try {
        result = await prisma.schedule.findUnique({
            where: { schedule_id: id },
            include:{
                owner:{
                    select:{
                        username:true
                    }
                }
            }
        });
        // return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { error: error.message };
        } else {
            console.error('An unknown error occurred');
            return { error: 'An unknown error occurred' };
        }
    }
    return result;
};

interface updateRoompProps{
    [key:string]:string
}
export const updateRoom = async ({id,allowedUser,slug,owner}:updateRoompProps) => {
    console.log("updating the schedule for",id,allowedUser,slug)

    try {
        const updatedSchedule = await prisma.schedule.update({
            where: { schedule_id: id },
            data:allowedUser? {
                allowed_users: [owner,allowedUser]
            }
            : {
                question_slug:slug
            }
        });
        return updatedSchedule;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { error: error.message };
        } else {
            console.error('An unknown error occurred');
            return { error: 'An unknown error occurred' };
        }
    }
};
