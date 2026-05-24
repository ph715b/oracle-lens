-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "set" TEXT NOT NULL,
    "setName" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "domains" TEXT[],
    "rarity" TEXT NOT NULL,
    "energyCost" INTEGER,
    "furyPower" INTEGER NOT NULL DEFAULT 0,
    "calmPower" INTEGER NOT NULL DEFAULT 0,
    "mindPower" INTEGER NOT NULL DEFAULT 0,
    "bodyPower" INTEGER NOT NULL DEFAULT 0,
    "chaosPower" INTEGER NOT NULL DEFAULT 0,
    "orderPower" INTEGER NOT NULL DEFAULT 0,
    "wildPower" INTEGER NOT NULL DEFAULT 0,
    "alternateCost" BOOLEAN NOT NULL DEFAULT false,
    "might" INTEGER,
    "mightBonus" INTEGER,
    "huntValue" INTEGER,
    "levelThreshold" INTEGER,
    "levelAbility" TEXT,
    "cardText" TEXT,
    "flavorText" TEXT,
    "keywords" TEXT[],
    "imageUrl" TEXT,
    "imageArtist" TEXT,
    "legalStandard" BOOLEAN NOT NULL DEFAULT true,
    "legalCasual" BOOLEAN NOT NULL DEFAULT true,
    "releasedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalCards" INTEGER NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");
