-- CreateTable
CREATE TABLE "UserRelationship" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "relatedUserId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "UserRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRelationship_userId_relatedUserId_type_key" ON "UserRelationship"("userId", "relatedUserId", "type");

-- AddForeignKey
ALTER TABLE "UserRelationship" ADD CONSTRAINT "UserRelationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelationship" ADD CONSTRAINT "UserRelationship_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
