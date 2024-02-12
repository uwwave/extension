import {
    JobPosting,
    PostingListDataCoop,
    PostingListDataFulltime,
} from './job.ts'
import { JobBoard } from './jobBoard.ts'

/* jobKeys.ts
 *
 * Avoid changing key names; these are used in the website
 * However, change the values as needed if WaterlooWorks changes
 * The value is searched to match the WaterlooWorks scraped data to the keys
 */

export enum PostingSections {
    applicationInformation = 'Application Information', // for coop
    applicationDelivery = 'Application Delivery', // not for coop
    companyInformation = 'Company Information', // for coop
    companyInfo = 'Company Info', // not for coop
    jobPostingInformation = 'Job Posting Information', // for all jobs
}

export enum CompanyInfoFields {
    division = 'Division',
    organization = 'Organization',
}

// As of May 9, 2023, these are the only fields
export enum AppInfoFields {
    deadline = 'Application Deadline',
    documentsRequired = 'Application Documents Required',
    additionalInfo = 'Additional Application Information',
    method = 'Application Method',
}

// As of May 9, 2023, these are the fields
export enum JobInfoFieldsCoop {
    additionalInformation = 'Additional Information',
    additionalJobIdentifiers = 'Additional Job Identifiers',
    compensationAndBenefitsInformation = 'Compensation and Benefits Information',
    employerInternalJobNumber = 'Employer Internal Job Number',
    jobAddressLineOne = 'Job - Address Line One',
    jobAddressLineTwo = 'Job - Address Line Two',
    jobCity = 'Job - City',
    jobCountry = 'Job - Country',
    jobPostalCode = 'Job - Postal Code / Zip Code (X#X #X#)',
    jobProvince = 'Job - Province / State',
    jobCategoryNoc = 'Job Category (NOC)',
    jobLocation = 'Job Location (if exact address unknown or multiple locations)',
    jobResponsibilities = 'Job Responsibilities',
    jobSummary = 'Job Summary',
    jobTitle = 'Job Title',
    jobType = 'Job Type',
    level = 'Level',
    numberOfJobOpenings = 'Number of Job Openings',
    region = 'Region',
    requiredSkills = 'Required Skills',
    specialJobRequirements = 'Special Job Requirements',
    targetedDegreesAndDisciplines = 'Targeted Degrees and Disciplines',
    transportationAndHousing = 'Transportation and Housing',
    workTerm = 'Work Term',
    workTermDuration = 'Work Term Duration',
}

// As of Mar 17, 2023, these are the only fields
export enum AppDeliveryFields {
    additionalInfo = 'Additional Application Information',
    deadline = 'Application Deadline',
    delivery = 'Application Delivery',
    documentsRequired = 'Application Documents Required',
    ifByWebsiteGoTo = 'If by Website, go to',
    ifByEmailSendTo = 'If by eMail, send to',
}

// As of Mar 17, 2023, these are the only fields
export enum JobInfoFieldsFulltime {
    additionalInfo = 'Additional Information',
    careerDevelopmentAndTraining = 'Career Development and Training',
    compensationAndBenefits = 'Compensation and Benefits',
    employerInternalJobNumber = 'Employer Internal Job Number',
    jobCategoryNoc = 'Job Category (NOC)',
    jobOpenings = 'Job Openings',
    jobResponsibilities = 'Job Responsibilities',
    jobSummary = 'Job Summary',
    jobTitle = 'Job Title',
    level = 'Level',
    otherJobDetails = 'Other Job Details',
    positionType = 'Position Type',
    region = 'Region',
    requiredSkills = 'Required Skills',
    startDate = 'Start Date',
    targetedDegreesAndDisciplines = 'Targeted Degrees and Disciplines',
    termPosted = 'Term Posted',
    transportationAndHousing = 'Transportation and Housing',
}

export interface PostingPageDataCoop {
    [PostingSections.applicationInformation]: {
        [key in AppInfoFields]: string
    }
    [PostingSections.companyInformation]: {
        [key in CompanyInfoFields]: string
    }
    [PostingSections.jobPostingInformation]: {
        [key in JobInfoFieldsCoop]: string
    }
}

export interface PostingPageDataFulltime {
    [PostingSections.applicationDelivery]: {
        [key in AppInfoFields]: string
    }
    [PostingSections.companyInfo]: {
        [key in CompanyInfoFields]: string
    }
    [PostingSections.jobPostingInformation]: {
        [key in JobInfoFieldsFulltime]: string
    }
}

export interface JobPostingCoop extends JobPosting {
    jobBoard: JobBoard.coop
    postingListData: PostingListDataCoop
    pageData: PostingPageDataCoop
}

export interface JobPostingFulltime extends JobPosting {
    jobBoard: JobBoard.fulltime
    postingListData: PostingListDataFulltime
    pageData: PostingPageDataFulltime
}
