import { AppState } from "../types";
export const seedState: AppState = {
  topPriorities:["Submit five quality job applications","Complete fitness block","Read 20 pages"],
  checklist:[
    {id:"1",text:"Morning brief",done:false},{id:"2",text:"Workout",done:false},{id:"3",text:"Career block",done:false},
    {id:"4",text:"Financial action",done:false},{id:"5",text:"Read 20 pages",done:false},{id:"6",text:"Clean 15 minutes",done:false},
    {id:"7",text:"No gaming before mission complete",done:false}
  ],
  sitrep:{status:"Active",win:"",obstacle:"",correction:"",lesson:"",tomorrow:""},
  applications:[{company:"Example Company",role:"Director of Operations",date:"2026-07-01",status:"Applied",followUp:"2026-07-08",notes:"Tailor executive resume."}],
  books:[{title:"Tuesdays with Morrie",author:"Mitch Albom",progress:"Planned",lesson:""}],
  finance:{emergencyFund:0,income:0,expenses:0,netWorth:0},
  weight:312
};