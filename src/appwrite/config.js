import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client(); // Appwrite client instance, we get it from Appwrite SDK
  databases; // Appwrite databases instance, we get it from Appwrite SDK too defined later in constructor
  storage; // Appwrite storage instance, we get it from Appwrite SDK too defined later in constructor

  constructor() {
    // here we get our ENVIRONMENT VARIABLES from conf.js and set them to the Appwrite client instance
    this.client
      .setEndpoint(conf.appwriteUrl) // Your Appwrite Endpoint
      .setProject(conf.appwriteProjectId); // Your project ID

    this.databases = new Databases(this.client); // here we initialize the databases instance using the client instance
    this.storage = new Storage(this.client); // here we initialize the storage instance using the client instance
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId, // ✅ Add this line!
        }
      );
    } catch (error) {
      console.log("Appwrite Service - Create Post Error: ", error);
      throw error; // Also throw the error so PostForm can catch it
    }
}

  async deletePost(slug) {
    // function to delete a post by its slug (document ID)
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );

      return true;
    } catch (error) {
      console.log("Appwrite Service - Delete Post Error: ", error);
      return false;
    }
  }

  async getPost(slug) {
    // function to get a post by its slug (document ID)

    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite Service - Get Post Error: ", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    // function to get all posts

    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite Service - Get Posts Error: ", error);
      return false;
    }
  }

  // FILE UPLOAD SERVICE:

  async uploadFile(file) {
    // function to upload a file to Appwrite storage

    try {
      return await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(), // generating a unique ID for the file
        file
      );
    } catch (error) {
      console.log("Appwrite Service - Upload File Error: ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    // function to delete a file from Appwrite storage

    try {
      await this.storage.deleteFile(conf.appwriteBucketId, fileId);

      return true;
    } catch (error) {
      console.log("Appwrite Service - Delete File Error: ", error);
      return false;
    }
  }

  // UPDATE POST SERVICE:

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite Service - Update Post Error:", error);
    }
  }

  getFilePreview(fileId) {
    // function to get a file preview URL from Appwrite storage

    return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
  }
}


const service = new Service()
export default service