import { ValidationError } from "./responses";
import { hasDuplicateKeys } from "./utils";

const TechStacks = {
    JAVA: "java",
    Java8Plus: "java-8+",
    SpringBoot: "spring-boot",
    Spring: "spring",

    ReactJS: "react-js",
    NextJS: "next-js",
    JavaScript: "javascript",
    EcmaScript: "ecma-script",
    TypeScript: "typescript",

    Microservices: "micro-services",
    Docker: "docker",
    Kubernetes: "k8s",
    Maven: "maven",
    Gradle: "gradle",
    Ant: "apache-ant",
    Git: "git",
    GitHub: "git-hub",
    BitBucket: "bit-bucket",
    GitLab: "git-lab",

    ApplicationServer:'application-server',
    Tomcat:'apache-tomcat',
    Weblogic:'weblogic',
    Websphere:'ibm-websphere',

    Database:'database',
    RelationalDatabases:'relational-databases',
    MySQL:'mysql',
    NoSQLDatabases:'no-sql-databases',
    MongoDB:'mongodb',    

    VersionControl:'vcs',
    CVS:'cvs',
    SVN:'svn',
    GIT:'git'
};

const techStackIsKindOf={

}

const techStackDependsOn = {
    [TechStacks.SpringBoot]: [TechStacks.JAVA, TechStacks.Spring],
    [TechStacks.NextJS]: [TechStacks.ReactJS],
    [TechStacks.GitHub]: [TechStacks.Git],
    [TechStacks.BitBucket]: [TechStacks.Git],
    [TechStacks.BitBucket]: [TechStacks.Git],
};

const prepareData = () => {
    return Object.keys(TechStacks).map((key) => {
        const uniqueId = TechStacks[key];
        const data = {
            uniqueId: uniqueId,
            name: key,
            dependsOn: techStackDependsOn[uniqueId] || [],
        };
        return data;
    });
};

export const getAllTechStacks = () => {
    let computedTechStacks = [];
    try {
        const hasDuplicateKeysResponse = hasDuplicateKeys(TechStacks);
        if (hasDuplicateKeysResponse.isError) {
            throw new ValidationError(
                "Found duplicate keys.",
                hasDuplicateKeysResponse.messages
            );
        }

        computedTechStacks = prepareData();

        return { succcess: true, data: computedTechStacks, messages: [] };
    } catch (e) {
        if (e instanceof ValidationError) {
            return { succcess: false, data: null, messages: e.data };
        }
    }
};
