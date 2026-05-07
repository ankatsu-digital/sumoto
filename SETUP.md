# アンカツ+ (Sumoto) - セットアップガイド

## 📋 概要

アンカツ+は洲本市の地域ニュースを発信するデジタルメディアです。
このプロジェクトは以下の2つのHTMLファイルで完結しています：

- **index.html** - 一般ユーザー向けニュースサイト
- **admin.html** - 管理画面（記事の作成・編集・削除）

技術スタック：
- HTML5 + CSS3 + Vanilla JavaScript
- Firebase（Authentication, Firestore, Storage）
- CDN経由でFirebase SDKを読み込み

---

## 🚀 初期セットアップ手順

### 1. Firebase プロジェクト設定

#### 1.1 Firebase コンソールで認証を有効化

```
Firebase Console → ankatsu-d4816 → Authentication
```

**有効化する認証方法：**
- ✅ メール / パスワード

**手順：**
1. 「Authentication」を開く
2. 「Sign-in method」タブをクリック
3. 「メール / パスワード」を有効化
4. 保存

#### 1.2 管理者アカウントを作成

```
Firebase Console → Authentication → Users
```

**手順：**
1. 「ユーザーを追加」ボタンをクリック
2. 以下を入力：
   - **メールアドレス**: admin@ankatsu-plus.local (または任意のメール)
   - **パスワード**: 強力なパスワード（最低6文字）
3. 「ユーザーを追加」をクリック

**このアカウント情報で admin.html にログインできます**

---

### 2. Firestore Database セットアップ

#### 2.1 Firestore を作成

```
Firebase Console → Firestore Database
```

**手順：**
1. 「データベースを作成」をクリック
2. 地域を選択（デフォルト: asia-northeast1 推奨）
3. セキュリティルール：「本番環境モードで開始」を選択
4. 「作成」をクリック

#### 2.2 セキュリティルールを設定

```
Firebase Console → Firestore → Rules
```

**以下のルールをコピー＆ペーストして上書き：**

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Articles Collection
    match /articles/{document=**} {
      // 公開記事は全員読み取り可能
      allow read: if resource.data.published == true;
      
      // 認証済みユーザーのみ下書きを読み取り可能
      allow read: if request.auth != null && isAdmin();
      
      // 管理者のみ作成・更新・削除可能
      allow create, update, delete: if request.auth != null && isAdmin();
    }
    
    // Helper Functions
    function isAdmin() {
      return request.auth.token.get("admin", false) == true;
    }
  }
}
```

「公開」ボタンをクリック

#### 2.3 articles コレクションを作成（任意）

最初のテスト記事は admin.html から追加できるため、ここでの作成は不要です。

---

### 3. Storage 設定

```
Firebase Console → Storage
```

**手順：**
1. 「セットアップを開始」をクリック
2. デフォルト設定で「次へ」
3. 地域を選択（Firestore と同じ地域推奨）
4. 「完了」をクリック

**デフォルトのセキュリティルール：**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

このルールで管理者のみがファイルをアップロード・削除できます。

---

### 4. 管理者権限の設定（重要）

Firebase Admin SDK を使用して、作成したアカウントに管理者権限を付与します。

#### 方法A: Firebase CLI を使用（推奨）

```bash
# 1. Firebase CLI をインストール
npm install -g firebase-tools

# 2. Firebase にログイン
firebase login

# 3. プロジェクトを初期化
firebase init

# 4. 管理者権限を付与する Node.js スクリプト作成
```

**set-admin.js** ファイルを作成：

```javascript
const admin = require('firebase-admin');

// serviceAccountKey.json をダウンロードして配置
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userEmail = 'admin@ankatsu-plus.local'; // ここを管理者メールに変更

admin.auth().getUserByEmail(userEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ ${userEmail} に管理者権限を付与しました`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
```

実行：
```bash
node set-admin.js
```

#### 方法B: Google Cloud Console を使用

```
Google Cloud Console → Cloud Functions
```

以下の関数をデプロイ：

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'ログインが必要です'
    );
  }

  const userEmail = data.email;
  try {
    const user = await admin.auth().getUserByEmail(userEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: '管理者権限を付与しました' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

---

## 📝 記事の管理

### 記事の作成・編集・削除

1. **admin.html にアクセス**
   ```
   https://yourdomain.com/admin.html
   ```

2. **管理者アカウントでログイン**
   - メールアドレス: 作成したメール
   - パスワード: 設定したパスワード

3. **「新規作成」タブで記事を追加**
   - タイトル
   - スラッグ（URL用、例: `sumoto-event-2026`）
   - カテゴリ
   - 著者名
   - サムネイル画像
   - 本文（リッチテキスト対応）
   - タグ
   - 注目記事フラグ
   - 公開フラグ

4. **「記事一覧」タブで管理**
   - 編集：既存記事を更新
   - 削除：不要な記事を削除
   - ステータス表示：公開中/下書き/注目記事

### 記事のデータ構造

Firestore の articles コレクションに保存：

```json
{
  "title": "洲本駅前リノベーション完成",
  "slug": "sumoto-station-renovation",
  "category": "まちづくり",
  "author": "編集部",
  "body": "<p>本文（HTML形式）</p>",
  "thumbnail": "https://storage.googleapis.com/...",
  "tags": ["駅前", "商店街", "リノベーション"],
  "featured": true,
  "published": true,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## 🔐 セキュリティ

### Firestore ルール

- **公開記事**: 全員が読み取り可能
- **下書き**: 管理者のみ読み取り可能
- **作成・編集・削除**: 管理者のみ

### Storage ルール

- **画像アップロード**: 管理者のみ
- **画像削除**: 管理者のみ
- **画像閲覧**: 全員可能

### 認証

- Firebase Authentication（メール＆パスワード）
- カスタムクレーム `admin: true` で権限管理
- セッション情報は Firebase が管理

---

## 🎨 カスタマイズ

### Firebase Config の変更

`index.html` と `admin.html` 内の以下を編集：

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

値は Firebase Console の「プロジェクト設定」から取得できます。

### デフォルトカテゴリ

`admin.html` の datalist を編集：

```html
<datalist id="categoryList">
    <option value="イベント">
    <option value="まちづくり">
    <option value="商店街">
    <!-- ここに追加 -->
</datalist>
```

---

## 📱 デプロイ

### GitHub Pages でホスト

```bash
# リポジトリを GitHub にプッシュ
git push origin main

# Settings → Pages
# Source: main branch
# Save
```

自動的に以下でアクセス可能：
```
https://ankatsu-digital.github.io/sumoto/
```

### Firebase Hosting でホスト

```bash
# 1. Firebase Hosting を初期化
firebase init hosting

# 2. ファイルをデプロイ
firebase deploy
```

---

## 🐛 トラブルシューティング

### ログインできない

- ✅ メールアドレスが正確か確認
- ✅ パスワードが正確か確認
- ✅ Firebase Console で該当ユーザーが存在するか確認
- ✅ ブラウザのコンソール（F12）でエラーを確認

### 記事が表示されない

- ✅ Firestore に articles コレクションが存在するか確認
- ✅ 記事の `published` フラグが `true` か確認
- ✅ Firestore セキュリティルールが正しく設定されているか確認
- ✅ ブラウザコンソールでエラーを確認

### 画像がアップロードできない

- ✅ Firebase Storage が有効化されているか確認
- ✅ Storage のセキュリティルールが管理者を許可しているか確認
- ✅ ファイルサイズが大きすぎないか確認（推奨: 5MB以下）

---

## 📊 本番環境チェックリスト

- [ ] Firebase Authentication でメール/パスワード認証が有効
- [ ] 管理者アカウントが作成済み
- [ ] 管理者権限（custom claims）が設定済み
- [ ] Firestore セキュリティルールが「本番環境モード」
- [ ] Storage セキュリティルールが適切に設定
- [ ] index.html と admin.html の Firebase Config が正しい
- [ ] HTTPS でホストされている（セキュリティ上必須）
- [ ] ダークモードが機能しているか確認
- [ ] モバイルデバイスでのレスポンシブ対応を確認
- [ ] 記事のカテゴリが正しく表示されるか確認

---

## 📖 ファイル一覧

```
sumoto/
├── index.html          # 公開用ニュースサイト
├── admin.html          # 管理画面
├── firestore.rules     # Firestore セキュリティルール
├── SETUP.md           # このファイル
└── README.md          # プロジェクト概要
```

---

## 📞 サポート

問題が発生した場合：

1. ブラウザの開発者ツール（F12）でコンソールを確認
2. Firebase Console でログを確認
3. GitHub Issues でレポート

---

## 📄 ライセンス

このプロジェクトはアンカツ城下町洲本のためのプロジェクトです。

---

**最終更新**: 2026年5月7日
