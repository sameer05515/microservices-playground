type ProjectInfoType={
    purpose:string;
    references:string;
    milestonesAndSteps:[string];
};

const mileStone_1=`
Milestone 1:
- [Step]: [Planned]: Set up blank GraphQL server with TS
- [Step]: [Planned]: Move basic folder in 'src/01-basic-server', so that we can set up multiple version of servers in single project.
    - Target to do so is to simulate and repeat the process of creating different versions of servers, untill we are not achieving purpose of the project.
- [Step]: [Planned]: Modularize the application into meaningful files.
- [Step]: [Planned]: In this vesrion, try to include simple examples of all the three special root operation types: Query, Mutation, and Subscription
`;

const projInfo:ProjectInfoType={
    purpose:`
        ## Purpose of this project

        [Planned]: [Started: 24-Oct-2024, Completed On: --- ]:  
            To understand how to use GraphQL with TypeScript

        [Planned]: [Started: 24-Oct-2024, Completed On: --- ]:  
            I want to migrate current \`example-base-03\backend\resume-service\` project to TS project. This I will (definitely) in this project.
    `,
    references: `
        ## References:
            - [Get Started with Apollo Server](https://www.apollographql.com/docs/apollo-server/getting-started)
    `,
    milestonesAndSteps:[mileStone_1]
};

const welcome=`
################################################################

Welcome to this project!!


`;

const thankYou=`

-----------------------------------------------------------------

Different versions of servers in this project
    01-basic-server    
        npm run start:01-basic-server
    02-basic-server-modular
        npm run start:02-basic-server-modular
    

#################################################################
`;


console.log(welcome, projInfo, thankYou);