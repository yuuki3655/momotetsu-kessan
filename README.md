# 桃鉄風 決算メーカー (Momotetsu Financial Results Maker)

10年間の総資産推移を入力して、桃太郎電鉄風の決算画面を再現できるウェブアプリです。

## 🚀 Live Demo
**[https://yuuki3655.github.io/momotetsu-kessan/](https://yuuki3655.github.io/momotetsu-kessan/)**

## ✨ 特徴
- **4人対戦対応:** 最大4人の社長（プレイヤー）の資産推移を比較可能。
- **フレキシブル設定:** プレイ人数（1〜4人）とプレイ年数（1〜100年）を自由に変更できます。
- **本格アニメーション:** 臨時列車の通過や決算ロゴの演出を再現。
- **動的グラフ:** Rechartsを使用した、各プレイヤーの成長記録を折れ線グラフで表示。

## 🛠️ 開発環境
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS, Framer Motion
- **Visualization:** Recharts
- **Icons:** Lucide React

## 📦 デプロイ方法
GitHub Actionsにより、`main`ブランチへのプッシュで自動的にGitHub Pagesへデプロイされます。

```bash
# ローカルでの開発
npm install
npm run dev

# 手動デプロイ
npm run deploy
```
