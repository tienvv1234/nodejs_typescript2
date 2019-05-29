import * as express from 'express';
import Post from './post.interface';
import postModel from './posts.model';

export default class PostsController {
    public path = '/posts';
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .patch(`${this.path}/:id`, this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, this.createPost);
        // this.router.get(this.path, this.getAllPosts.bind(this))
    }

    modifyPost = (request: express.Request, response: express.Response) => {
        const id = request.params.id;
        const postData: Post = request.body;
        this.post.findByIdAndUpdate(id, postData, { new: true })
            .then(post => {
                response.send(post);
            })
    }


    getPostById = (request: express.Request, response: express.Response) => {
        const id = request.params.id;
        this.post.findById(id)
            .then(post => {
                response.send(post);
            })
    }

    getAllPosts = (request: express.Request, response: express.Response) => {
        this.post.find()
            .then(posts => {
                response.send(posts);
            })
    }

    // function definition need use bind function for using this 
    // getAllPosts(request: express.Request, response: express.Response) {
    //     response.send(this.posts);
    // }

    createPost = (request: express.Request, response: express.Response) => {
        const postData: Post = request.body;
        const createdPost = new this.post(postData);
        createdPost.save()
            .then(savedPost => {
                response.send(savedPost);
            })
    }

    deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            response.send(200);
        } else {
            next(new Error(id));
        }
    }

}