-- CreateTable
CREATE TABLE "ToDo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LabelsOnToDos" (
    "labelId" TEXT NOT NULL,
    "toDoId" TEXT NOT NULL,

    PRIMARY KEY ("labelId", "toDoId"),
    CONSTRAINT "LabelsOnToDos_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabelsOnToDos_toDoId_fkey" FOREIGN KEY ("toDoId") REFERENCES "ToDo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
