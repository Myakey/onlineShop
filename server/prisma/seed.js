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

    // ===== ALL INDONESIAN PROVINCES =====
    const provincesCount = await prisma.indonesian_provinces.count();
    
    if (provincesCount === 0) {
      console.log('Adding all Indonesian provinces...');
      
      const allProvinces = [
        { name: 'Nusa Tenggara Barat', providerId: 1 },
        { name: 'Maluku', providerId: 2 },
        { name: 'Kalimantan Selatan', providerId: 3 },
        { name: 'Kalimantan Tengah', providerId: 4 },
        { name: 'Jawa Barat', providerId: 5 },
        { name: 'Bengkulu', providerId: 6 },
        { name: 'Kalimantan Timur', providerId: 7 },
        { name: 'Kepulauan Riau', providerId: 8 },
        { name: 'Aceh', providerId: 9 },
        { name: 'DKI Jakarta', providerId: 10 },
        { name: 'Banten', providerId: 11 },
        { name: 'Jawa Tengah', providerId: 12 },
        { name: 'Jambi', providerId: 13 },
        { name: 'Papua', providerId: 14 },
        { name: 'Bali', providerId: 15 },
        { name: 'Sumatera Utara', providerId: 16 },
        { name: 'Gorontalo', providerId: 17 },
        { name: 'Jawa Timur', providerId: 18 },
        { name: 'DI Yogyakarta', providerId: 19 },
        { name: 'Sulawesi Tenggara', providerId: 20 },
        { name: 'Nusa Tenggara Timur', providerId: 21 },
        { name: 'Sulawesi Utara', providerId: 22 },
        { name: 'Sumatera Barat', providerId: 23 },
        { name: 'Bangka Belitung', providerId: 24 },
        { name: 'Riau', providerId: 25 },
        { name: 'Sumatera Selatan', providerId: 26 },
        { name: 'Sulawesi Tengah', providerId: 27 },
        { name: 'Kalimantan Barat', providerId: 28 },
        { name: 'Papua Barat', providerId: 29 },
        { name: 'Lampung', providerId: 30 },
        { name: 'Kalimantan Utara', providerId: 31 },
        { name: 'Maluku Utara', providerId: 32 },
        { name: 'Sulawesi Selatan', providerId: 33 },
        { name: 'Sulawesi Barat', providerId: 34 }
      ];

      const createdProvinces = {};

      for (const provinceData of allProvinces) {
        const province = await prisma.indonesian_provinces.create({
          data: {
            province_name: provinceData.name
          }
        });
        
        createdProvinces[provinceData.name] = province;

        // Create shipping provider mapping for province
        await prisma.shipping_provider_mappings.create({
          data: {
            provider_name: 'rajaongkir',
            entity_type: 'province',
            entity_id: province.province_id,
            provider_id: provinceData.providerId,
            province_id: province.province_id
          }
        });
      }
      
      console.log(`✓ ${allProvinces.length} provinces created`);

      // ===== BANTEN CITIES & DISTRICTS (Test Data) =====
      console.log('Adding detailed data for Banten province...');
      
      const bantenProvince = createdProvinces['Banten'];

      const bantenCities = [
        { name: 'Cilegon', providerId: 143 },
        { name: 'Pandeglang', providerId: 144 },
        { name: 'Lebak', providerId: 147 },
        { name: 'Serang', providerId: 148 },
        { name: 'Tangerang', providerId: 592 },
        { name: 'Tangerang Selatan', providerId: 594 }
      ];

      const createdCities = {};
      
      for (const cityData of bantenCities) {
        const city = await prisma.indonesian_cities.create({
          data: {
            province_id: bantenProvince.province_id,
            city_name: cityData.name
          }
        });
        
        createdCities[cityData.name] = city;

        // Create shipping provider mapping for city
        await prisma.shipping_provider_mappings.create({
          data: {
            provider_name: 'rajaongkir',
            entity_type: 'city',
            entity_id: city.city_id,
            provider_id: cityData.providerId,
            province_id: bantenProvince.province_id,
            city_id: city.city_id
          }
        });
      }
      console.log(`✓ ${bantenCities.length} cities created for Banten`);

      // TANGERANG DISTRICTS
      const tangerangDistricts = [
        { name: 'Tangerang', zip: '15111', providerId: 6158 },
        { name: 'Ciledug', zip: '15153', providerId: 6159 },
        { name: 'Batuceper', zip: '15122', providerId: 6160 },
        { name: 'Benda', zip: '15125', providerId: 6161 },
        { name: 'Cibodas', zip: '15138', providerId: 6162 },
        { name: 'Cipondoh', zip: '15148', providerId: 6163 },
        { name: 'Jatiuwung', zip: '15135', providerId: 6164 },
        { name: 'Karawaci', zip: '15115', providerId: 6165 },
        { name: 'Larangan', zip: '15154', providerId: 6166 },
        { name: 'Neglasari', zip: '15129', providerId: 6167 },
        { name: 'Periuk', zip: '15131', providerId: 6168 },
        { name: 'Pinang', zip: '15145', providerId: 6169 },
        { name: 'Karang Tengah', zip: '15157', providerId: 6170 },
        { name: 'Tigaraksa', zip: '15720', providerId: 6171 },
        { name: 'Balaraja', zip: '15610', providerId: 6172 },
        { name: 'Cikupa', zip: '15710', providerId: 6173 },
        { name: 'Cisoka', zip: '15730', providerId: 6174 },
        { name: 'Curug', zip: '15810', providerId: 6175 },
        { name: 'Kronjo', zip: '15560', providerId: 6176 },
        { name: 'Kresek', zip: '15760', providerId: 6177 },
        { name: 'Legok', zip: '15820', providerId: 6178 },
        { name: 'Mauk', zip: '15530', providerId: 6179 },
        { name: 'Pasar Kemis', zip: '15560', providerId: 6180 },
        { name: 'Pakuhaji', zip: '15570', providerId: 6181 },
        { name: 'Rajeg', zip: '15540', providerId: 6182 },
        { name: 'Sepatan', zip: '15520', providerId: 6183 },
        { name: 'Teluknaga', zip: '15510', providerId: 6185 },
        { name: 'Cisauk', zip: '15341', providerId: 6189 },
        { name: 'Jambe', zip: '15345', providerId: 6190 },
        { name: 'Jayanti', zip: '15640', providerId: 6191 },
        { name: 'Kemiri', zip: '15560', providerId: 6192 },
        { name: 'Kosambi', zip: '15212', providerId: 6193 },
        { name: 'Pagedangan', zip: '15339', providerId: 6194 },
        { name: 'Panongan', zip: '15710', providerId: 6195 },
        { name: 'Sukadiri', zip: '15730', providerId: 6196 },
        { name: 'Sukamulya', zip: '15610', providerId: 6197 },
        { name: 'Solear', zip: '15730', providerId: 6198 },
        { name: 'Sindang Jaya', zip: '15560', providerId: 6199 },
        { name: 'Sepatan Timur', zip: '15520', providerId: 6202 },
        { name: 'Mekar Baru', zip: '15560', providerId: 6203 },
        { name: 'Kelapa Dua', zip: '15810', providerId: 6204 },
        { name: 'Gunung Kaler', zip: '15560', providerId: 6205 }
      ];

      for (const districtData of tangerangDistricts) {
        const district = await prisma.indonesian_districts.create({
          data: {
            city_id: createdCities['Tangerang'].city_id,
            district_name: districtData.name,
            zip_code: districtData.zip
          }
        });

        // Create shipping provider mapping for district
        await prisma.shipping_provider_mappings.create({
          data: {
            provider_name: 'rajaongkir',
            entity_type: 'district',
            entity_id: district.district_id,
            provider_id: districtData.providerId,
            province_id: bantenProvince.province_id,
            city_id: createdCities['Tangerang'].city_id,
            district_id: district.district_id
          }
        });
      }
      console.log(`✓ ${tangerangDistricts.length} districts created for Tangerang`);

      // TANGERANG SELATAN DISTRICTS
      const tangselDistricts = [
        { name: 'Serpong', zip: '15310', providerId: 6184 },
        { name: 'Pondok Aren', zip: '15224', providerId: 6186 },
        { name: 'Pamulang', zip: '15417', providerId: 6187 },
        { name: 'Ciputat', zip: '15411', providerId: 6188 },
        { name: 'Setu', zip: '15314', providerId: 6200 },
        { name: 'Serpong Utara', zip: '15323', providerId: 6201 },
        { name: 'Ciputat Timur', zip: '15412', providerId: 6206 }
      ];

      for (const districtData of tangselDistricts) {
        const district = await prisma.indonesian_districts.create({
          data: {
            city_id: createdCities['Tangerang Selatan'].city_id,
            district_name: districtData.name,
            zip_code: districtData.zip
          }
        });

        // Create shipping provider mapping for district
        await prisma.shipping_provider_mappings.create({
          data: {
            provider_name: 'rajaongkir',
            entity_type: 'district',
            entity_id: district.district_id,
            provider_id: districtData.providerId,
            province_id: bantenProvince.province_id,
            city_id: createdCities['Tangerang Selatan'].city_id,
            district_id: district.district_id
          }
        });
      }
      console.log(`✓ ${tangselDistricts.length} districts created for Tangerang Selatan`);

      console.log('\n✅ Indonesian location data seeded successfully!');
      console.log(`  - ${allProvinces.length} Provinces (All Indonesia)`);
      console.log(`  - ${bantenCities.length} Cities (Banten only)`);
      console.log(`  - ${tangerangDistricts.length + tangselDistricts.length} Districts (Tangerang & Tangerang Selatan only)`);
      
    } else {
      console.log('✓ Location data already exists, skipping');
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Note: All 34 provinces are available. Detailed cities/districts are only for Banten (for testing).');
    console.log('    You can add more cities/districts as needed for other provinces.\n');

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