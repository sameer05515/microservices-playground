import { gql } from '@apollo/client';

// Define the GraphQL mutation for upserting a resume
export const UPSERT_RESUME = gql`
  mutation UpsertResume($resume: ResumeInput!) {
    upsertResume(resume: $resume) {
      uniqueId
      introduction
      summary
      processedDetails{
        rawText
        textType
        metadata
      }
      companies {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
        projects {
          uniqueId
          name
          details
          processedDetails{
            rawText
            textType
            metadata
          }
        }
      }
      educations {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
      }
    }
  }
`;

// GraphQL query to fetch all resumes
export const GET_RESUMES = gql`
  query GetResumes {
    getAllResumes {
      uniqueId
      introduction
      summary
      processedDetails{
        rawText
        textType
        metadata
      }
      companies {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
        projects {
          uniqueId
          name
          details
          processedDetails{
            rawText
            textType
            metadata
          }
        }
      }
      educations {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
      }
    }
  }
`;

export const GET_RESUME = gql`
  query GetResume($uniqueId: String!) {
    getResume(uniqueId: $uniqueId) {
      uniqueId
      introduction
      summary
      processedDetails{
        rawText
        textType
        metadata
      }
      companies {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
        projects {
          uniqueId
          name
          details
          processedDetails{
            rawText
            textType
            metadata
          }
        }
      }
      educations {
        uniqueId
        name
        details
        processedDetails{
          rawText
          textType
          metadata
        }
      }
    }
  }
`;