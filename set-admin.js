#!/usr/bin/env node

/**
 * Firebase Admin Setup Script
 * 管理者権限を付与するスクリプト
 * 
 * 使用方法:
 * 1. serviceAccountKey.json をこのファイルと同じ場所に配置
 * 2. npm install firebase-admin
 * 3. node set-admin.js admin@example.com
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// serviceAccountKey.json のパス
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ エラー: serviceAccountKey.json が見つかりません');
  console.error('\n以下の手順で serviceAccountKey.json を取得してください:');
  console.error('1. Firebase Console を開く');
  console.error('2. プロジェクト設定 → サービス アカウント');
  console.error('3. 「新しい秘密鍵を生成」をクリック');
  console.error('4. ダウンロードしたファイルを serviceAccountKey.json に名前変更');
  console.error('5. このスクリプトと同じディレクトリに配置');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Firebase Admin SDK を初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// コマンドライン引数からメールアドレスを取得
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('📝 使用方法:');
  console.log('  node set-admin.js <メールアドレス>');
  console.log('\n例:');
  console.log('  node set-admin.js admin@ankatsu-plus.local');
  process.exit(0);
}

// メールアドレスの検証
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.error('❌ エラー: 無効なメールアドレスです');
  process.exit(1);
}

console.log(`⏳ ${userEmail} に管理者権限を付与中...`);

// 管理者権限を付与
admin.auth().getUserByEmail(userEmail)
  .then(user => {
    console.log(`✅ ユーザーが見つかりました (UID: ${user.uid})`);
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ ${userEmail} に管理者権限を付与しました`);
    console.log('\n✨ 次のステップ:');
    console.log('1. admin.html にアクセス');
    console.log(`2. メール: ${userEmail}`);
    console.log('3. パスワード: Firebase で設定したパスワード');
    console.log('でログインしてください');
    process.exit(0);
  })
  .catch(error => {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ エラー: ${userEmail} というユーザーが見つかりません`);
      console.error('\n以下の手順で先にユーザーを作成してください:');
      console.error('1. Firebase Console を開く');
      console.error('2. Authentication → Users');
      console.error('3. 「ユーザーを追加」をクリック');
      console.error(`4. メール: ${userEmail}`);
      console.error('5. パスワード: 任意のパスワード');
    } else {
      console.error(`❌ エラー: ${error.message}`);
    }
    process.exit(1);
  });
