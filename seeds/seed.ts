import { PrismaClient } from '@prisma/client';

const prisma =new PrismaClient();

async function main(){
  //    company group
  const companyGroups=[
    {name:'Tata'},
    {name:'Reliance'},
    {name:'Bajaj'},
    {name:'Godrej'},
  ];
  
  await prisma.companyGroup.createMany({
    data: companyGroups,
    // if name already exists thn skip
    skipDuplicates: true,
  });

  //  company group map to ID
  const companyGroupMap=await prisma.companyGroup.findMany({
    where:{
      OR:companyGroups.map((group : {name:string}) =>({
        name:group.name,
      })),
    },
    select:{
      id:true,
      name:true,
    },
  });

  // companys data
  const companiesData=[
    {
      name:'Tata Motors Ltd',
      pan:'ADGCF2896J',
      pan_name:'Tata Motors Ltd',
      aadhar:'256987452369',
      gstin:'27ADGCF2896J1ZL',
      company_group_name:'Tata',
      contact_person:'Subramanyan Swami',
      phone:'9876543210',
      email_id:'contact@tata.in',
    },
    {
      name:'Reliance Digital',
      pan:'DFGCV5942L',
      pan_name:'Reliance Digital',
      aadhar:'789587269147',
      gstin:'27DFGCV5942L1ZR',
      company_group_name:'Reliance',
      contact_person:'Vivekanand Ghosh',
      phone:'8745632109',
      email_id:'contact@reliance.in',
    },
    {
      name:'Bajaj',
      pan:'',
      pan_name:'V Nilakanth',
      aadhar:'7456321098',
      gstin:'',
      company_group_name:'Bajaj',
      contact_person:'V Nilakanth',
      phone:'7456321098',
      email_id:'contact@bajaj.in',
    },
    {
      name:'Godrej',
      pan:'',
      pan_name:'N sooryagayathri',
      aadhar:'9925632541',
      gstin:'',
      company_group_name:'Godrej',
      contact_person:'N sooryagayathri',
      phone:'9925632541',
      email_id:'contact@godrej.in',
    },
  ];

  const companyIdMap={};
  companyGroupMap.forEach((group)=> {
    companyIdMap[group.name] =group.id;
  });

  

  await prisma.company.createMany( {
    data: companiesData.map((company)=>({
      ...company,
      company_group_id:companyIdMap[company.company_group_name],
    })),
  });
}

main()
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  }).finally(async ( )=>{
    await prisma.$disconnect();
  });
