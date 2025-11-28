# TeamPro - Identity & Tracking System

Sui Blockchain tabanlı işçi kimlik ve aktivite takip sistemi. Fabrika/işyeri ortamlarında çalışan takibi, kapı geçişleri, makine kullanımı ve performans ölçümü için blockchain destekli çözüm.

## 🎯 Özellikler

### 🔐 Blockchain Tabanlı Kimlik Sistemi
- **Soulbound Worker Cards**: Transfer edilemeyen, blockchain'de saklanan çalışan kimlik kartları
- **Güvenli ve Şeffaf**: Tüm işlemler blockchain'de kayıt altında
- **Değiştirilemez Kayıtlar**: Aktivite geçmişi immutable

### 📊 Takip ve İzleme
- **Kapı Geçiş Takibi**: Giriş-çıkış kayıtları
- **Makine Kullanım İzleme**: Hangi çalışan, hangi makineyi ne kadar kullandı
- **Mesai Takibi**: Clock in/out sistemi
- **Üretim Metrikleri**: Üretim miktarı, verimlilik skorları

### 👥 Kullanıcı Rolleri
- **Admin**: Worker card oluşturma, kapı/makine ekleme, ödül verme
- **Worker**: Kendi aktivitelerini görüntüleme ve kayıt yapma
- **Dashboard**: Real-time istatistikler ve analytics

### 🏆 Gamification
- Performans bazlı ödül sistemi
- Puan sıralaması (leaderboard)
- Başarı rozetleri

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Sui Wallet (tarayıcı eklentisi)
- Sui CLI (contract deployment için)

### Kurulum

```bash
# Repository'yi klonla
git clone <repo-url>
cd Team

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev
```

### Contract Deployment

Detaylı deployment rehberi için: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Hızlı Adımlar:**

1. Smart contract'ı deploy et:
```bash
cd identity_system
sui client publish --gas-budget 100000000
```

2. Deploy çıktısından Package ID ve SystemRegistry ID'yi kaydet

3. `src/config/contracts.ts` dosyasını güncelle:
```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0xYOUR_PACKAGE_ID',
  SYSTEM_REGISTRY_ID: '0xYOUR_REGISTRY_ID',
  MODULE_NAME: 'identity',
}
```

4. Frontend'i başlat:
```bash
npm run dev
```

## 📁 Proje Yapısı

```
Team/
├── src/
│   ├── components/
│   ├── config/
│   │   └── contracts.ts          # Contract adresleri ve config
│   ├── hooks/
│   │   └── useIdentity.ts        # Custom React hooks
│   ├── types/
│   │   └── identity.ts           # TypeScript tip tanımları
│   ├── utils/
│   │   └── transactions.ts       # Transaction builder'lar
│   ├── AdminPanel.tsx            # Admin paneli
│   ├── WorkerPanel.tsx           # Çalışan paneli
│   ├── Dashboard.tsx             # Analytics dashboard
│   └── main.tsx                  # App giriş noktası
├── identity.move                 # Smart contract
├── DEPLOYMENT_GUIDE.md           # Deployment rehberi
├── CONTRACT_IMPROVEMENTS.md      # Contract iyileştirme önerileri
└── README.md
```

## 🔧 Teknoloji Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Recharts** - Data visualization

### Blockchain
- **Sui Blockchain** - Layer 1 blockchain
- **Move Language** - Smart contract dili
- **@mysten/dapp-kit** - Sui React SDK
- **@mysten/sui** - Sui TypeScript SDK

## 📖 Kullanım

### Admin İşlemleri

1. **Worker Card Oluşturma**
   - `/admin` sayfasına git
   - "Çalışan Kartları" sekmesini seç
   - Formu doldur ve "Kart Oluştur"

2. **Kapı/Makine Ekleme**
   - İlgili sekmeyi seç
   - Bilgileri gir ve kaydet

3. **Ödül Verme**
   - "Ödül Ver" sekmesini seç
   - Worker Card ID, ödül tipi ve puan belirle

### Worker İşlemleri

1. **Mesai Başlatma/Bitirme**
   - `/worker` sayfasına git
   - "Mesai Başlat" veya "Mesai Bitir" butonuna tıkla

2. **Kapı Geçişi Kaydetme**
   - "İşlemler" sekmesine git
   - Kapı ID ve geçiş türünü seç
   - "Kaydet" butonuna tıkla

3. **Makine Kullanımı Kaydetme**
   - Makine ID, kullanım süresi, üretim ve verimlilik gir
   - Transaction'ı onayla

### Dashboard

- Real-time istatistikler
- Kapı geçiş grafikleri
- Makine kullanım analizi
- Çalışan performans tablosu
- Ödül sıralaması

## 🔐 Güvenlik

- **Soulbound Tokens**: Worker card'lar transfer edilemez
- **Access Control**: AdminCap ile yetki kontrolü
- **Immutable Records**: Blockchain'de değiştirilemez kayıtlar
- **Event Logging**: Tüm işlemler event olarak kaydedilir

## ⚠️ Contract İyileştirmeleri

**v2.0 Güncellemesi Tamamlandı! ✅**

Güvenlik ve fonksiyonellik iyileştirmeleri yapıldı:

### Yapılan İyileştirmeler:

1. ✅ **AdminCap Kontrolü**: Tüm yönetim fonksiyonlarında AdminCap kontrolü eklendi
2. ✅ **Card Ownership**: Worker'ların sadece kendi card'larını kullanabilmesi garanti edildi
3. ✅ **Update Fonksiyonları**: Door/Machine/Worker Card güncelleme fonksiyonları eklendi
4. ✅ **Activate/Deactivate**: Soft delete sistemi (veriler korunur)
5. ✅ **Batch Operations**: Toplu işlem fonksiyonları (%30-50 gas tasarrufu)
6. ✅ **Admin Management**: AdminCap transfer ve çoklu admin desteği
7. ✅ **Card Active Status**: Worker card'lar devre dışı bırakılabilir

### Yeni Özellikler:

**Admin Paneli:**
- 🔧 Yönetim sekmesi eklendi
- Worker Card güncelleme
- Card aktif/deaktif yapma
- Yeni admin oluşturma

**Worker Paneli:**
- Inactive card kontrolü
- Devre dışı card uyarısı

**Transaction İşlemleri:**
- 13 yeni transaction builder fonksiyonu
- Güvenli ownership kontrolü
- Batch operations desteği

Detaylı değişiklikler için: [CONTRACT_CHANGELOG.md](./CONTRACT_CHANGELOG.md)

## 📊 Event Türleri

Contract tarafından emit edilen event'ler:

- **DoorAccessEvent**: Kapı geçişleri
- **MachineUsageEvent**: Makine kullanımı
- **ClockEvent**: Mesai giriş/çıkış
- **AwardEvent**: Ödül verilmesi
- **StatsUpdateEvent**: İstatistik güncellemeleri

## 🚧 Roadmap

- [ ] Mobile app (React Native)
- [ ] IoT entegrasyonu (RFID/NFC okuyucular)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PDF/CSV export
- [ ] Shift management
- [ ] Leave management
- [ ] Performance-based auto rewards

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 🔗 Kaynaklar

- [Sui Documentation](https://docs.sui.io)
- [Move Language Book](https://move-book.com)
- [Sui Developer Portal](https://sui.io/developers)
- [Sui Explorer (Testnet)](https://suiscan.xyz/testnet)

## 💬 Destek

Sorularınız veya sorunlarınız için:
- GitHub Issues açın
- Discord: [Sui Discord](https://discord.gg/sui)

---

**Not:** Bu proje testnet üzerinde geliştirilmiştir. Mainnet'e deploy etmeden önce kapsamlı testler yapın ve profesyonel bir security audit yaptırın.

