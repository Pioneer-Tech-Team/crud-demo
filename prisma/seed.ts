import { CompanyGroup, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
	const defaultUser = await prisma.user.upsert({
		where: { email: "default@example.com" },
		update: {},
		create: {
			email: "default@example.com",
			name: "Example User",
			password: bcrypt.hashSync("default"),
		},
	});

	const companyGroups = [
		{
			company_group_name: "Tata",
			contact_person: "Subramanyan Swami",
			phone: "9876543210",
			email_id: "contact@tata.in",
		},
		{
			company_group_name: "Reliance",
			contact_person: "Vivekanand Ghosh",
			phone: "8745632109",
			email_id: "contact@reliance.in",
		},
		{
			company_group_name: "Bajaj",
			contact_person: "V Nilakanth",
			phone: "7456321098",
			email_id: "contact@bajaj.in",
		},
		{
			company_group_name: "Godrej",
			contact_person: "N Sooryagayathri",
			phone: "9925632541",
			email_id: "contact@godrej.in",
		},
	];

	await prisma.company.deleteMany();
	await prisma.companyGroup.deleteMany();

	for (const companyGroup of companyGroups) {
		await prisma.companyGroup.create({
			data: { ...companyGroup, entered_by: defaultUser.id },
		});
	}

	const companies = [
		{
			name: "Tata Motors Ltd.",
			pan: "ADGCF2896J",
			panName: "Tata Motors Ltd.",
			aadhar: "256987452369",
			companyGroupName: "Tata",
			gstin: "22ADGCF2896J1Z5",
		},
		{
			name: "Reliance Digital",
			pan: "DFGCV5942L",
			panName: "Reliance Digital",
			aadhar: "789587269147",
			companyGroupName: "Reliance",
			gstin: "09DFGCV5942L1Z9",
		},
	];

	for (const company of companies) {
		const companyGroup = await prisma.companyGroup.findFirstOrThrow({
			where: { company_group_name: company.companyGroupName },
		});

		await prisma.company.create({
			data: {
				aadhar: company.aadhar,
				gstin: company.gstin,
				name: company.name,
				pan: company.pan,
				panName: company.panName,
				companyGroup: companyGroup.company_group_id,
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
