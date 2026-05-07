# アンカツ+（プラス）- Sumoto Stories

> 兵庫県洲本市の地域密着型デジタルニュースメディア

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Firebase](https://img.shields.io/badge/Firebase-v12-orange)

---

## 📰 プロジェクト概要

**アンカツ+（プラス）** は、洲本市の地域情報を発信する、新聞とデジタルメディアが融合したニュースサイトです。

### 🎯 コンセプト

```
「地域を面でつなぐ」

地方の小さな声を、デジタルで広げる。
地域文化の記録、まちのアーカイブとして機能する。
```

### 🌟 特徴

- ✨ **新聞型レイアウト** - 左メイン記事、右ニュース一覧の新聞感を再現
- 📱 **フルレスポンシブ** - スマートフォン、タブレット、PCに対応
- 🌙 **ダークモード** - 読みやすさを重視した2つのカラースキーム
- 🔐 **Firebase統合** - 認証、データベース、ストレージ一体管理
- ⚡ **軽量・高速** - CDN経由のFirebase SDK、外部ライブラリ最小化
- 🎨 **温かみのあるデザイン** - シニア層から若者まで幅広い年代に対応

---

## 🚀 クイックスタート

### 1️⃣ リポジトリをクローン

```bash
git clone https://github.com/ankatsu-digital/sumoto.git
cd sumoto
```

### 2️⃣ 依存パッケージをインストール

```bash
npm install
```

### 3️⃣ Firebase セットアップ

詳細は **[SETUP.md](./SETUP.md)** を参照してください。

**最小限の手順:**

```bash
# 1. Firebase プロジェクトを作成
#    https://console.firebase.google.com

# 2. Firestore Database を作成（本番環境モード）

# 3. Authentication を有効化（メール/パスワード）

# 4. 管理者アカウントを作成

# 5. 管理者権限を付与
node set-admin.js admin@example.com
```

### 4️⃣ ローカルで起動

```bash
npm start
# ブラウザで http://localhost:8080 を開く
```

### 5️⃣ デプロイ

```bash
firebase deploy
```

---

## 📁 ファイル構成

```
sumoto/
├── index.html              # 🌐 公開ニュースサイト
├── admin.html              # 🔐 管理画面
├── firestore.rules         # 🔒 Firestore セキュリティルール
├── set-admin.js            # 👤 管理者権限設定スクリプト
├── package.json            # 📦 依存パッケージ
├── SETUP.md               # 📝 セットアップガイド
├── README.md              # 📖 このファイル
└── .gitignore             # 🚫 Git無視設定
```

**重要: 2ファイルのみで完結**
- CSS と JavaScript は各 HTML に埋め込み
- 外部 CSS/JS ファイルなし
- Firebase SDK のみ CDN から読み込み

---

## 🎨 デザイン

### 色彩設計

| 要素 | 色コード | 用途 |
|------|---------|------|
| プライマリ | `#1b5e20` | 見出し、ボタン、アクセント |
| セカンダリ | `#0277bd` | リンク、サブ要素 |
| アクセント | `#ff6f00` | 注目記事、警告 |
| 背景 | `#ffffff` | メイン背景 |
| テキスト | `#212121` | 本文 |

### レイアウト

#### index.html（ニュースサイト）

```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├──────────────────┬──────────────────┤
│  メイン記事      │   最新ニュース     │
│  (65-70%)       │   (30-35%)        │
│                  │                   │
│  関連ニュース    │                   │
│  (グリッド表示)  │                   │
└──────────────────┴──────────────────┘
```

#### admin.html（管理画面）

```
┌─────────────────────────────────────┐
│  ヘッダー                             │
├─────────────────────────────────────┤
│  タブ: [記事一覧] [新規作成]          │
├─────────────────────────────────────┤
│  記事一覧 / フォーム                  │
└─────────────────────────────────────┘
```

---

## 🔐 セキュリティ

### Firestore ルール

```firestore
// 公開記事は全員読み取り可能
allow read: if resource.data.published == true;

// 下書きは管理者のみ読み取り可能
allow read: if request.auth != null && isAdmin();

// 作成・更新・削除は管理者のみ
allow create, update, delete: if request.auth != null && isAdmin();
```

### 認証フロー

1. **ログイン**
   - メール + パスワード（Firebase Authentication）
   - カスタムクレーム `admin: true` を確認

2. **権限検証**
   - Firestore セキュリティルールで自動検証
   - 無許可のアクセスは自動ブロック

3. **セッション管理**
   - Firebase が自動管理
   - ブラウザに安全に保存

---

## 📊 Firestore データ構造

### articles コレクション

```json
{
  "id": "auto-generated",
  "title": "洲本駅前リノベーション完成",
  "slug": "sumoto-station-renovation",
  "category": "まちづくり",
  "author": "編集部",
  "body": "<p>HTML形式の本文</p>",
  "thumbnail": "https://storage.googleapis.com/...",
  "tags": ["駅前", "商店街"],
  "featured": true,
  "published": true,
  "createdAt": "2026-05-07T12:00:00Z",
  "updatedAt": "2026-05-07T12:00:00Z"
}
```

---

## 🛠️ 機能一覧

### index.html（公開サイト）

- ✅ 記事一覧表示
- ✅ 注目記事表示
- ✅ カテゴリフィルタ
- ✅ 全文検索
- ✅ タグ検索
- ✅ 記事詳細表示
- ✅ ダークモード
- ✅ レスポンシブデザイン
- ✅ ハンバーガーメニュー

### admin.html（管理画面）

- ✅ ユーザー認証（メール/パスワード）
- ✅ 記事一覧表示
- ✅ 記事作成
- ✅ 記事編集
- ✅ 記事削除
- ✅ 画像アップロード
- ✅ リッチテキスト編集
- ✅ タグ管理
- ✅ 注目記事設定
- ✅ 公開/下書き切り替え

---

## 📱 ブラウザ対応

| ブラウザ | バージョン | 対応状況 |
|---------|-----------|--------|
| Chrome | 最新 | ✅ 完全対応 |
| Firefox | 最新 | ✅ 完全対応 |
| Safari | 最新 | ✅ 完全対応 |
| Edge | 最新 | ✅ 完全対応 |
| IE11 | - | ⚠️ 非対応 |

---

## 📈 パフォーマンス

### ページサイズ

- index.html: ~35KB
- admin.html: ~40KB
- 外部ライブラリ: Firebase SDK（CDN）

### 読み込み時間

- 初回読み込み: ~2秒
- 記事読み込み: ~0.5秒
- 検索: リアルタイム

---

## 🚀 デプロイ

### GitHub Pages

```bash
git push origin main
# Settings → Pages → main branch を選択
```

**URL**: `https://ankatsu-digital.github.io/sumoto/`

### Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

**URL**: Firebase プロジェクト設定で確認

---

## 🐛 トラブルシューティング

### よくある問題と解決方法

| 問題 | 原因 | 解決方法 |
|------|------|--------|
| ログインできない | メアドまたはパスワード誤り | Firebase Console で確認 |
| 記事が表示されない | published フラグが false | admin.html で公開に変更 |
| 画像がアップロードできない | Storage ルール不適切 | SETUP.md のルール確認 |
| 管理画面にアクセスできない | 管理者権限がない | `node set-admin.js` で権限付与 |

詳細は **[SETUP.md](./SETUP.md)** のトラブルシューティングセクションを参照してください。

---

## 📞 サポート

### 質問・問題報告

- 📧 Email: support@ankatsu-digital.local
- 🐛 Issues: https://github.com/ankatsu-digital/sumoto/issues
- 💬 Discussions: https://github.com/ankatsu-digital/sumoto/discussions

---

## 👥 コントリビューション

改善提案・バグ報告を歓迎します。

```bash
# フォーク
git clone https://github.com/YOUR_USERNAME/sumoto.git

# ブランチ作成
git checkout -b feature/amazing-feature

# コミット
git commit -am 'Add amazing feature'

# プッシュ
git push origin feature/amazing-feature

# プルリクエスト
```

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

---

## 🙏 謝辞

このプロジェクトは、洲本市の地域活性化を目指す
「生涯活躍のまち」の特区にしたい会
の協力により実現しました。

---

## 📚 参考資料

- [Firebase Documentation](https://firebase.google.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## 🗺️ ロードマップ

### v1.0（現在）
- ✅ 基本的なニュースサイト
- ✅ 管理画面
- ✅ Firebase 統合

### v1.1（予定中）
- 📝 コメント機能
- 📊 アクセス解析
- 🔔 メール通知

### v2.0（将来）
- 📱 モバイルアプリ
- 🤖 AI 記事推奨
- 📺 動画対応

---

## 📊 統計

```
ファイル数: 4
コード行数: ~3,000 行
依存ライブラリ: Firebase SDK (CDN)
開発期間: 2026年5月
最終更新: 2026年5月7日
```

---

<div align="center">

**洲本のまち、人、イベント、文化を、デジタルで繋ぐ。**

[🌐 サイトを開く](#) | [🔐 管理画面](#) | [📖 ドキュメント](#)

</div>

---

Made with ❤️ by [ankatsu-digital](https://github.com/ankatsu-digital)
