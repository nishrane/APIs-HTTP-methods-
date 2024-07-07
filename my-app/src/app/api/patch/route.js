import connectdb from "../../../../config/config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request) {
    try {
        // Extract studentId from query parameters
        const { searchParams } = new URL(request.url);
        const searchid = searchParams.get('StudentId');
        
        if (!searchid) {
            return NextResponse.json({ error: 'StudentId is required' }, { status: 400 });
        }

        const userId = parseInt(searchid, 10);

        // Extract fields to update from request body
        const { Name, email, course, city } = await request.json();

        // Validate at least one field is present for update
        if (!Name && !email && !course && !city) {
            return NextResponse.json({ error: 'At least one field (Name, email, course, city) is required for update' }, { status: 400 });
        }

        // Establish database connection
        const connectiondb = await connectdb();

        // Retrieve current user data from database
        const [existingUserData] = await connectiondb.execute('SELECT * FROM users WHERE StudentId = ?', [userId]);
        
        // Check if user exists
        if (existingUserData.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Merge existing data with updated fields from request body
        const updatedUserData = {
            ...existingUserData[0],
            Name: Name || existingUserData[0].Name,
            email: email || existingUserData[0].email,
            course: course || existingUserData[0].course,
            city: city || existingUserData[0].city
        };

        // Prepare fields and values for the update query
        const updateFields = [];
        const updateValues = [];

        if (Name) {
            updateFields.push('Name = ?');
            updateValues.push(Name);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (course) {
            updateFields.push('course = ?');
            updateValues.push(course);
        }
        if (city) {
            updateFields.push('city = ?');
            updateValues.push(city);
        }

        // Construct and execute the update query
        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE StudentId = ?`;
        const updateQueryValues = [...updateValues, userId];
        const [result] = await connectiondb.execute(updateQuery, updateQueryValues);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'No changes made' }, { status: 400 });
        }

        // Return success response with updated user data
        return NextResponse.json({
            message: 'User updated successfully',
            data: updatedUserData
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Cannot update user in database' }, { status: 500 });
    }
}
