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

  // @ts-expect-error - indexing allFakers is safe with the fallback
  const faker: Faker = allFakers[localeCode] || allFakers.en_US;

  // Handle Gender
  const sex = (genderParam === "male" || genderParam === "female") 
    ? genderParam 
    : undefined;

  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  
  // Generate Comprehensive Identity Data
  const identity = {
    locale: localeCode,
    personal: {
      fullName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      gender: faker.person.sex(),
      bio: faker.person.bio(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
      zodiac: faker.person.zodiacSign(),
    },
    contact: {
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
    },
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      timeZone: faker.location.timeZone(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      }
    },
    job: {
      company: faker.company.name(),
      title: faker.person.jobTitle(),
      descriptor: faker.person.jobDescriptor(),
      area: faker.person.jobArea(),
    },
    finance: {
      creditCardNumber: faker.finance.creditCardNumber('####-####-####-####'),
      creditCardExpiry: `${String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0')}/${String(faker.number.int({ min: 25, max: 30 }))}`,
      creditCardCvv: faker.finance.creditCardCVV(),
      iban: faker.finance.iban(),
      bitcoin: faker.finance.bitcoinAddress(),
      ethereum: faker.finance.ethereumAddress(),
      currency: faker.finance.currency().name,
    },
    internet: {
      username: faker.internet.username({ firstName, lastName }),
      password: faker.internet.password(),
      ip: faker.internet.ipv4(),
      mac: faker.internet.mac(),
      userAgent: faker.internet.userAgent(),
      uuid: faker.string.uuid(),
      domain: faker.internet.domainName(),
    },
    vehicle: {
      model: faker.vehicle.vehicle(),
      type: faker.vehicle.type(),
      vin: faker.vehicle.vin(),
      fuel: faker.vehicle.fuel(),
    },
    travel: {
      airline: faker.airline.airline().name,
      airport: faker.airline.airport().name,
    }
  };

  return NextResponse.json(identity);
}
