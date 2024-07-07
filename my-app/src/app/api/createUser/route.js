import connectdb from "../../../../config/config";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request) {
    try {
        
        const {StudentId, Name, email,course,city}=await request.json();
        if (!StudentId|| !Name || !email||!course||!city) {
            return NextResponse.json({ error: 'All feilds are required' }, { status: 400 });
        }
        const connectiondb=await connectdb();
        const [user]= await connectiondb.execute('INSERT INTO users (StudentId, Name, email,course,city) VALUES(?,?,?,?,?)',[StudentId,Name, email,course,city]);

        return NextResponse.json({ 
            message: "User added sucessfully",
            data: user,
            body:{
                "StudentId":StudentId,
                "Name":Name,
                "email":email,
                "course":course,
                "city":city
            }
         }, { status: 201 })
    } catch (error) {
        return NextResponse.json({error:"Cannot add user to database"},{status:500})
    }
}