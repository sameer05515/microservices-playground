// GreenApple WebWare, New Delhi, India
// HCL Infosystems Ltd, Noida, India
// Novelvox Software India Pvt Ltd (previously known as Integration Services & Technologies India PVT LTD), Faridabad, India
// Concentrix Daksh Services India Private Limited, Gurgaon, India
// Accenture, Mumbai, India
// Dhani stocks Limited, (formerly Indiabulls security Ltd , Indiabulls ventures ltd), Gurgaon, India
// Mynd Integrated Solutions Ltd, Gurgaon, India
// RSystems International Pvt Ltd, Noida, India
// EVC Ventures, Gurgaon, India

import { projects, projects } from "./projects";
import { ValidationError } from "./responses";
import { hasDuplicateKeys } from "./utils";

// Zycus Infotech Pvt. Ltd., Bangalore, India
export const Companies={
    GreenApple_WebWare:'greenApple-webWare',
    HCL_Infosystems:'hcl-infosystems-limited',
    Novelvox:'novelvox-software-india-private-limited',
    Concentrix:'concentrix-daksh-services-india-private-limited',
    Dhani_Stocks:'dhani-stocks-limited',
    RSystems:'rsystems-international-private-limited',
    EVC_Ventures:'evc-ventures',
    Zycus_Infotech:'zycus-infotech-private-limited'
};

const companyName={
    [Companies.GreenApple_WebWare]: 'GreenApple WebWare, New Delhi, India',
    [Companies.HCL_Infosystems]:'HCL Infosystems Ltd, Noida, India',
    [Companies.Novelvox]:'Novelvox Software India Pvt Ltd, Faridabad, India',
    [Companies.Concentrix]:'Concentrix Daksh Services India Private Limited, Gurgaon, India',
    [Companies.Dhani_Stocks]:'Dhani stocks Limited, Gurgaon, India',
    [Companies.RSystems]:'RSystems International Pvt Ltd, Noida, India',
    [Companies.EVC_Ventures]:'EVC Ventures, Gurgaon, India',
    [Companies.Zycus_Infotech]:'Zycus Infotech Pvt. Ltd., Bangalore, India',
};

const projects={
    [Companies.GreenApple_WebWare]: [projects.OSCART],
    [Companies.HCL_Infosystems]: [projects.CIPRUS],
    [Companies.Novelvox]:'Novelvox Software India Pvt Ltd, Faridabad, India',
    [Companies.Concentrix]:'Concentrix Daksh Services India Private Limited, Gurgaon, India',
    [Companies.Dhani_Stocks]:'Dhani stocks Limited, Gurgaon, India',
    [Companies.RSystems]:'RSystems International Pvt Ltd, Noida, India',
    [Companies.EVC_Ventures]:'EVC Ventures, Gurgaon, India',
    [Companies.Zycus_Infotech]:'Zycus Infotech Pvt. Ltd., Bangalore, India',
}

const prepareData=()=>{
    return Object.keys(Companies).map((key) => {
        const uniqueId = Companies[key];
        const data = {
            uniqueId: uniqueId,
            name: companyName[uniqueId],
            dependsOn: techStackDependsOn[uniqueId] || [],
        };
        return data;
    });
}


export const getAllCompanies=()=>{
    let computedCompanies = [];
    try {
        const hasDuplicateKeysResponse = hasDuplicateKeys(Companies);
        if (hasDuplicateKeysResponse.isError) {
            throw new ValidationError(
                "Found duplicate keys.",
                hasDuplicateKeysResponse.messages
            );
        }

        computedCompanies = prepareData();

        return { succcess: true, data: computedCompanies, messages: [] };
    } catch (e) {
        if (e instanceof ValidationError) {
            return { succcess: false, data: null, messages: e.data };
        }
    }
}