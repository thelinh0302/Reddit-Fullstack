import {Arg, Mutation , Resolver , Query, ID, UseMiddleware} from "type-graphql";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { CreatePostInput } from "../types/CreatePostInput";
import { Post } from "../entities/Post";
import { UpdatePostInput } from "../types/UpdatePostInput";
import { checkAuth } from "../middleware/checkAuth";

@Resolver()

export class PostResolver{
    @Mutation(_return => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async createPost(
        @Arg('createPostInput') { title, text }: CreatePostInput,
    ):
        Promise<PostMutationResponse>{
        try {
            const newPost = Post.create({
                title,
                text
            })
            await newPost.save() 
            return {
                code:200,
                success: true,
                message: 'Post created successfully',
                post: newPost
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            }
        }
    }

    @Query(_return => [Post],{nullable:true})
    async posts(): Promise<Post[]|null>{
        try {
            return Post.find()
        } catch (error) {
            return null
        }
    }

    @Query(_return => Post,{nullable:true})
    async post(
        @Arg('id', _type=>ID) id: number
    ): Promise<Post | undefined>{
        try {
            const post = await Post.findOne(id)
            return post
        } catch (error) {
            return undefined
        }
    }

    @Mutation(_return => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async updatePost(
        @Arg('updatePostInput') { id, title, text }: UpdatePostInput,
    ): Promise<PostMutationResponse>{
        try {
            const existingPost = await Post.findOne(id)
            if (!existingPost) {
                return {
                    code: 400,
                    success: false,
                    message: 'Post not found',
                }
            }
            existingPost.title = title
            existingPost.text = text

            await existingPost.save()
            return {
                code: 200,
                success: true,
                message: "Update post success",
                post: existingPost
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            }
        }
    }

    @Mutation(_return => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async deletePost(
        @Arg('id', _type => ID) id: number,
    ): Promise<PostMutationResponse>{
        try {
            const existingPost = await Post.findOne(id)
            if (!existingPost) {
                return {
                    code: 400,
                    message: "Post not found",
                    success: false
                }
            }
            
            await Post.delete({id})
            return {
                code: 200,
                success: true,
                message: "Delete post successfully",
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            }
        }

    }
}