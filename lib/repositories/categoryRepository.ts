import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { inventory: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { inventory: true },
        },
      },
    });
  },

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: {
        name,
      },
    });
  },

  async create(data: { name: string; description?: string }) {
    return prisma.category.create({
      data,
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};