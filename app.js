const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const prompt = require('prompt-sync')();

const User = require('./models/customer.js')


const connect = async () => {
    //initiate connection
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connection to Database Successful..')
    } catch (error) {
        console.log(error)
    }
}

const disconnect = async () => {
    try {
        await mongoose.disconnect()
        console.log('Disconnected from MongoDB');
        mongoose.connection.close()

    } catch (error) {
        console.log(error)
    }
}

const createCustomer = async (name, age) => {
    
    try {
        const newUser = await User.create({name, age})

        if(newUser) return (`id: ${newUser.id} -- Name: ${newUser.name}, Age: ${newUser.age}`)
    } catch (error) {
        console.log('Some Error')
    }      
}

const fetchAllUsers = () => {
    return User.find()
}

const deleteCustomer = async(id) => {
    await User.findByIdAndDelete(id)
    return 'Customer Successfully deleted!'
}

const updateUserDetails = async(id, name, age) => {
    console.log('Updating User Details...')
    const updatedUser =  await User.findByIdAndUpdate(id, { name, age}, {new: true})

    return `id: ${updatedUser.id} -- Name: ${updatedUser.name}, Age: ${updatedUser.age}`
}

const showTheListOfUsers = users => users.forEach(user => console.log(`id: ${user.id} -- Name: ${user.name}, Age: ${user.age}`))

//invoke the connection
console.log('Connecting to Database...')
connect()
.then( async() => {
    let userSelection = 0

    while (userSelection != 5) {
        console.log('\nWelcome to the CRM\n')
        console.log('1. Create a customer\n2. View all customers\n3. Update a customer\n4. Delete a customer\n5. Quit')

        let userInput = prompt('Number of action to run: ')

        const userChoice = parseInt(userInput)
        
        switch (userChoice) {
            case 1:
                //console.log('Create a customer')
                const userName = prompt('What is your name: ')
                const userAge = prompt('What is your age: ')
                const newCustomer = await  createCustomer(userName, userAge)
                console.log(newCustomer)
                break;
            case 2:
                //console.log('View all customers')
                // data should look like this 
                /*
                id: 658226acdcbecfe9b99d5421 --  Name: Bilbo, Age: 50
                id: 65825d1ead6cd90c5c430e24 --  Name: Vivienne, Age: 6
                */
                console.log('Fetching Users..')
                try {
                    const users = await fetchAllUsers()

                    showTheListOfUsers(users)
                } catch (error) {
                    console.log(error)
                }
                break;
            case 3:
                console.log('Fetching Users..')
                const users = await fetchAllUsers()
                console.log('Below are the list of customers:')
                showTheListOfUsers(users)
                //console.log() for space 
                console.log('\n')
                const usersIdToUpdate = prompt('Copy and paste the id of the customer you would like to update here: ')

                const newName = prompt('What is the customers new name?: ')
                const newAge = prompt('What is the customers new age?: ')

                const updatedCustomer = await updateUserDetails(usersIdToUpdate, newName, newAge)

                console.log(updatedCustomer)
                break;
            case 4:
                console.log('Fetching Users..')
                try {
                    const users = await fetchAllUsers()
                    console.log('Below are the list of customers:')
                    showTheListOfUsers(users)
                    //console.log() for space 
                    console.log('\n')
                    const usersIdtoDelete = prompt('Copy and paste the id of the customer you would like to delete here: ')

                    const deletedCustomer = await deleteCustomer(usersIdtoDelete)

                    console.log(deletedCustomer)
                } catch (error) {
                    
                }
                break;
            case 5:
                console.log('Disconnecting from MongoDB..')
                await disconnect()

                console.log('Ok Goodbye!')
                userSelection = 5
                process.exit()

            default:
                console.log('Invalid Input')
                break;
        }
    }
})
.catch( error => {
    console.log(error)
})






