import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Entertainment",
  "Gaming",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "Science and technology",
  "Pets and animals",
  "Sports",
  "Travel and events",
  "Vlogging",
];
async function main() {
  console.log("Seeding categories...");
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Description for ${name.toLowerCase()}`,
    }));
    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}
main();
