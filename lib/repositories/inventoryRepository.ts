import { prisma } from "@/lib/prisma";

export const inventoryRepository = {
  create(data: any) {
    return prisma.inventory.create({
      data,
      include: {
        category: true,
      },
    });
  },

  findAll() {
    return prisma.inventory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  update(id: string, data: any) {
    return prisma.inventory.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  delete(id: string) {
    return prisma.inventory.delete({
      where: { id },
    });
  },
};