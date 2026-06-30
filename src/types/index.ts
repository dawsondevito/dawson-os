export type Task={id:string;text:string;done:boolean};
export type Application={company:string;role:string;date:string;status:string;followUp:string;notes:string};
export type Book={title:string;author:string;progress:string;lesson:string};
export type Finance={emergencyFund:number;income:number;expenses:number;netWorth:number};
export type AppState={topPriorities:string[];checklist:Task[];sitrep:{status:string;win:string;obstacle:string;correction:string;lesson:string;tomorrow:string};applications:Application[];books:Book[];finance:Finance;weight:number};