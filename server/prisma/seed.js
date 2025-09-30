// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // ===== ADMIN USER =====
    const ADMIN_USERNAME = 'adminbebek';
    const ADMIN_EMAIL = 'admin@bebek.com';
    const ADMIN_PASSWORD = 'admin123';
    
    const existingAdmin = await prisma.users.findFirst({
      where: {
        OR: [
          { username: ADMIN_USERNAME },
          { email: ADMIN_EMAIL },
          { type: 'admin' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists:', existingAdmin.username);
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      const adminUser = await prisma.users.create({
        data: {
          username: ADMIN_USERNAME,
          first_name: "Budi Gunawan",
          email: ADMIN_EMAIL,
          password_hash: hashedPassword,
          type: 'admin',
          phone_number: '+628123456789',
          email_verified: true
        }
      });

      console.log('✓ Admin user created successfully:', adminUser.username);
    }

    // ===== SAMPLE PRODUCTS =====
    const productsCount = await prisma.products.count();
    
    if (productsCount === 0) {
      await prisma.products.createMany({
        data: [
          {
            name: 'Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 299000,
            stock: 50,
            image_url: 'https://via.placeholder.com/300'
          },
          {
            name: 'Smart Watch',
            description: 'Fitness tracking smartwatch with heart rate monitor',
            price: 899000,
            stock: 30,
            image_url: 'https://via.placeholder.com/300'
          },
          {
            name: 'Laptop Backpack',
            description: 'Durable waterproof backpack for laptops up to 15.6 inch',
            price: 249000,
            stock: 100,
            image_url: 'https://via.placeholder.com/300'
          }
        ]
      });
      
      console.log('✓ Sample products created');
    } else {
      console.log('✓ Products already exist, skipping');
    }

    // ===== INDONESIAN PROVINCES (JAVA ISLAND) =====
    const provincesCount = await prisma.indonesian_provinces.count();
    
    if (provincesCount === 0) {
      console.log('Adding Java Island provinces...');
      
      // Java Island Provinces
      const provinces = [
        { province_name: 'DKI Jakarta', province_code: 'JK' },
        { province_name: 'Jawa Barat', province_code: 'JB' },
        { province_name: 'Jawa Tengah', province_code: 'JT' },
        { province_name: 'DI Yogyakarta', province_code: 'YO' },
        { province_name: 'Jawa Timur', province_code: 'JI' },
        { province_name: 'Banten', province_code: 'BT' }
      ];

      for (const province of provinces) {
        await prisma.indonesian_provinces.create({
          data: province
        });
      }

      console.log('✓ Java Island provinces created');

      // ===== CITIES FOR EACH PROVINCE =====
      console.log('Adding cities for each province...');

      // DKI Jakarta
      const jakarta = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'JK' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: jakarta.province_id, city_name: 'Jakarta Pusat', city_type: 'Kota' },
          { province_id: jakarta.province_id, city_name: 'Jakarta Utara', city_type: 'Kota' },
          { province_id: jakarta.province_id, city_name: 'Jakarta Barat', city_type: 'Kota' },
          { province_id: jakarta.province_id, city_name: 'Jakarta Selatan', city_type: 'Kota' },
          { province_id: jakarta.province_id, city_name: 'Jakarta Timur', city_type: 'Kota' },
          { province_id: jakarta.province_id, city_name: 'Kepulauan Seribu', city_type: 'Kabupaten' }
        ]
      });

      // Jawa Barat
      const jawaBarat = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'JB' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: jawaBarat.province_id, city_name: 'Kota Bandung', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Bandung', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Bandung Barat', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Bekasi', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Bekasi', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Bogor', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Bogor', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Cirebon', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Cirebon', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Depok', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Sukabumi', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Sukabumi', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Tasikmalaya', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Tasikmalaya', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Cimahi', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kota Banjar', city_type: 'Kota' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Garut', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Purwakarta', city_type: 'Kabupaten' },
          { province_id: jawaBarat.province_id, city_name: 'Kabupaten Karawang', city_type: 'Kabupaten' }
        ]
      });

      // Jawa Tengah
      const jawaTengah = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'JT' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: jawaTengah.province_id, city_name: 'Kota Semarang', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Semarang', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kota Surakarta', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kota Magelang', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Magelang', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kota Pekalongan', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Pekalongan', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kota Tegal', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Tegal', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kota Salatiga', city_type: 'Kota' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Sukoharjo', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Klaten', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Purwokerto', city_type: 'Kabupaten' },
          { province_id: jawaTengah.province_id, city_name: 'Kabupaten Cilacap', city_type: 'Kabupaten' }
        ]
      });

      // DI Yogyakarta
      const yogyakarta = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'YO' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: yogyakarta.province_id, city_name: 'Yogyakarta', city_type: 'Kota' },
          { province_id: yogyakarta.province_id, city_name: 'Sleman', city_type: 'Kabupaten' },
          { province_id: yogyakarta.province_id, city_name: 'Bantul', city_type: 'Kabupaten' },
          { province_id: yogyakarta.province_id, city_name: 'Kulon Progo', city_type: 'Kabupaten' },
          { province_id: yogyakarta.province_id, city_name: 'Gunung Kidul', city_type: 'Kabupaten' }
        ]
      });

      // Jawa Timur
      const jawaTimur = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'JI' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: jawaTimur.province_id, city_name: 'Kota Surabaya', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Malang', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Malang', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Kediri', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Kediri', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Blitar', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Blitar', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Mojokerto', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Mojokerto', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Pasuruan', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Pasuruan', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Probolinggo', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Probolinggo', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Madiun', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Madiun', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kota Batu', city_type: 'Kota' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Sidoarjo', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Gresik', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Jember', city_type: 'Kabupaten' },
          { province_id: jawaTimur.province_id, city_name: 'Kabupaten Jombang', city_type: 'Kabupaten' }
        ]
      });

      // Banten
      const banten = await prisma.indonesian_provinces.findUnique({
        where: { province_code: 'BT' }
      });

      await prisma.indonesian_cities.createMany({
        data: [
          { province_id: banten.province_id, city_name: 'Kota Tangerang', city_type: 'Kota' },
          { province_id: banten.province_id, city_name: 'Kabupaten Tangerang', city_type: 'Kabupaten' },
          { province_id: banten.province_id, city_name: 'Kota Tangerang Selatan', city_type: 'Kota' },
          { province_id: banten.province_id, city_name: 'Kota Serang', city_type: 'Kota' },
          { province_id: banten.province_id, city_name: 'Kabupaten Serang', city_type: 'Kabupaten' },
          { province_id: banten.province_id, city_name: 'Kota Cilegon', city_type: 'Kota' },
          { province_id: banten.province_id, city_name: 'Kabupaten Lebak', city_type: 'Kabupaten' },
          { province_id: banten.province_id, city_name: 'Kabupaten Pandeglang', city_type: 'Kabupaten' }
        ]
      });

      console.log('✓ Cities added for all Java Island provinces');
    } else {
      console.log('✓ Provinces already exist, skipping');
    }

    console.log('\n✓ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });