import connectdb from "../../../../config/config";
import { NextRequest,NextResponse } from "next/server";

export async function PUT(request){
    try {
        const { searchParams } = new URL(request.url);
        const searchid= searchParams.get('StudentId');
        
        if(!searchid){
            return NextResponse.json({ error: 'Student Id is required' }, { status: 400 });
        }
        const userId = parseInt(searchid, 10);
        const {Name,email,course,city}= await request.json();
        const connectiondb=await connectdb();
        const [result] = await connectiondb.execute('UPDATE users SET Name = ?, email = ?,course = ?,city = ? WHERE StudentId = ?', [Name,email,course,city, userId]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User does not exist or No changes made' }, { status: 404 });
        }
        const upduser={
            "Studentid":userId,
            "Name":Name,
            "email":email,
            "course":course,
            "city":city
        }
        return NextResponse.json({
            message:"User updated successfully",
            data:upduser
        },{status:200})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: "Cannot update user in database" }, { status: 500 });
    }
}