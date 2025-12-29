import { NextResponse } from "next/server";
import { allFakers, type Faker } from "@faker-js/faker";
import { locales } from "@/lib/locales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") || "en_US";
  const genderParam = searchParams.get("gender");

  // Validate locale or fallback to en_US
  const isValidLocale = locales.some((l) => l.code === localeParam);
  const localeCode = isValidLocale ? localeParam : "en_US";

  // Select the specific faker instance for this locale
  // @ts-expect-error - indexing allFakers with string is safe here due to fallback
  const faker: Faker = allFakers[localeCode] || allFakers.en_US;

  // Handle Gender
  const sex = (genderParam === "male" || genderParam === "female") 
    ? genderParam 
    : undefined;

  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  
  // Generate Identity Data
  const identity = {
    locale: localeCode,
    fullName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    gender: faker.person.sex(),
    birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    username: faker.internet.username({ firstName, lastName }),
    password: faker.internet.password(),
    
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    
    job: {
      company: faker.company.name(),
      title: faker.person.jobTitle(),
    },
    
    finance: {
      creditCardNumber: faker.finance.creditCardNumber('####-####-####-####'),
      creditCardExpiry: `${String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0')}/${String(faker.number.int({ min: 25, max: 30 }))}`,
      creditCardCvv: faker.finance.creditCardCVV(),
      iban: faker.finance.iban(),
    },
    
    internet: {
      ip: faker.internet.ipv4(),
      mac: faker.internet.mac(),
      userAgent: faker.internet.userAgent(),
      uuid: faker.string.uuid(),
    }
  };

  return NextResponse.json(identity);
}
