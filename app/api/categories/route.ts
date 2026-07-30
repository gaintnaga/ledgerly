import { NextResponse,NextRequest } from "next/server";

import { categoryService } from "@/lib/services/categoryService";

export async function GET() {
    try{
        const categories = await categoryService.getAllCategories();

        return NextResponse.json(
            {
                success:true,
                data:categories,
            },
            {status:200}
        )
    }catch(error){
        console.error("Get Categories Error",error)
    }

    return NextResponse.json(
        {
            success:false,
            message : "Failed to fetch categories"
        },
        {status:500}
    )
}

export async function POST(request:NextRequest) {
    try{
        const body = await request.json();

        const {name,description} = body;

        if(!name || name.trim() === ""){
            return NextResponse.json(
                {
                    success:false,
                    message :"Category name requried"
                },
                {status:400}
            )
        }

        const category = await categoryService.createCategory({
            name : name.trim(),
            description,
        });

        return NextResponse.json(
            {
                success:true,
                message: "Category created successfully",
                data : category
            },
            {status:201}
        )
    }catch(error:any){
        return NextResponse.json({
            success:false,
            message: error.message || "Failed to create category"
    },{status:400})
    }
}