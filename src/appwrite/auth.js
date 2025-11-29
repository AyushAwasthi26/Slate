import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';


export class AuthService {
    client = new Client();  // Appwrite client instance, we get it from Appwrite SDK
    account; // Appwrite account instance, we get it from Appwrite SDK too defined later in constructor


// ACCOUNT TABHI BANEGA JAB PEHLI BAAR CONSTRUCTOR CALL HOGA!
constructor() {  // here we get our ENVIRONMENT VARIABLES from conf.js and set them to the Appwrite client instance
        this.client
            .setEndpoint(conf.appwriteUrl)        // Your Appwrite Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        
        this.account = new Account(this.client); // here we initialize the account instance using the client instance [ used for authentication ]
    }

    async createAccount({email, password, name}) {  // function to create a new account using VALUES FROM THE USER INPUT, maybe a form, if the account already exists, it will login the user instead 

        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name); // creating a new account using Appwrite SDK function [ .create() ] that we can now use with the account instance

            if (userAccount) {  // if account is created successfully, we login the user
                return this.login({email, password}); // ( login() func is defined below )
            } else {
                return userAccount; // return the created user account
            }

        }
        catch(error){ // to handle errors like account already exists
            throw error;
        }
    }



    // LOGIN == creating a session whereas SIGNUP == creating a new account
    // LOGOUT == deleting the session
    async login({email, password}) {  // function to login the user using VALUES FROM THE USER INPUT, maybe a form
        try { 
            return await this.account.createEmailPasswordSession(email, password);
        }

        catch (error) { // to handle errors like invalid credentials
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            // Don't log 401 errors - they're expected when no user is logged in
            if (error.code !== 401) {
                console.log('Appwrite Service - Get Current User Error: ', error);
            }
            return null; // Return null for "not logged in" state
        }
    }

    async logout() {  // function to logout the current user

        try {
            // await this.account.deleteSession('current'); // Deletes the current session
            await this.account.deleteSessions(); // Deletes all sessions for the current user
        } catch (error) {
            console.log('Appwrite Service - Logout Error: ', error);    
        }
    }
}

const authService = new AuthService();
export default authService;