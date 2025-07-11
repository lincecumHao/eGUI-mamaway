#!/bin/bash

# ==== 確認參數 ====
if [ -z "$1" ]; then
  echo "❌ 請輸入新的客戶 repo 名稱（例如：eGUI-customer-name ）"
  echo "用法: ./setup_customer_repo.sh eGUI-customer-name "
  exit 1
fi

CUSTOMER_REPO_NAME=$1
CORE_REPO_URL="git@github.com:lincecumHao/GateWeb_Invoice_GUI.git"
CUSTOMER_REPO_URL="git@github.com:lincecumHao/$CUSTOMER_REPO_NAME.git"

# ==== 開始處理 ====
echo "📦 從公版 repo clone 成新客戶 repo: $CUSTOMER_REPO_NAME"
TARGET_FOLDER="../${2:-$CUSTOMER_REPO_NAME}"
echo "📦 Clone 到 $TARGET_FOLDER"
git clone $CORE_REPO_URL "$TARGET_FOLDER"

cd "$TARGET_FOLDER" || exit 1

echo "🔧 設定 remote：把 origin 改成 upstream（公版）"
git remote rename origin upstream

echo "➕ 加入 origin，指向新客戶 repo"
git remote add origin "$CUSTOMER_REPO_URL"

echo "🚀 推送 main 到客戶 repo"
git push -u origin main

echo "✅ 完成！你現在可以開始在 $CUSTOMER_REPO_NAME 裡開發，公版 remote 為 'upstream'"
