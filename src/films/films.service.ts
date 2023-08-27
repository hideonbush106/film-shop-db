import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateFilmDto } from './dto/create-film.dto';
// import { UpdateFilmDto } from './dto/update-film.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto/film.dto';
import { Prisma } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class FilmsService {
  constructor(private prismaService: PrismaService) {}

  async findUserFilms(id: string) {
    const films = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        favoriteFilms: true,
      },
    });
    return films;
  }

  async create(createFilmDto: FilmDto) {
    try {
      const film = await this.prismaService.film.create({
        data: {
          title: createFilmDto.title,
          director: createFilmDto.director,
          nation: createFilmDto.nation,
          genre: createFilmDto.genre,
          description: createFilmDto.description,
          releaseDate: createFilmDto.releaseDate,
          rating: createFilmDto.rating,
          trailerURL: createFilmDto.trailerURL,
          posterURL: createFilmDto.posterURL,
        },
      });
      return film;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //Film already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Film already exists');
        }
      }
    }
  }

  async findAll() {
    const films = await this.prismaService.film.findMany({
      include: {
        User: false,
      },
    });
    return films;
  }

  async findOne(id: string) {
    try {
      const films = await this.prismaService.film.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          User: false,
        },
      });

      return films;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Film not found');
        }
      }
    }
  }

  async update(id: string, updateFilmDto: FilmDto) {
    try {
      await this.prismaService.film.findUniqueOrThrow({
        where: {
          id: id,
        },
      });

      const film = await this.prismaService.film.update({
        where: {
          id: id,
        },
        data: {
          title: updateFilmDto.title,
          director: updateFilmDto.director,
          nation: updateFilmDto.nation,
          genre: updateFilmDto.genre,
          description: updateFilmDto.description,
          releaseDate: updateFilmDto.releaseDate,
          rating: updateFilmDto.rating,
          trailerURL: updateFilmDto.trailerURL,
          posterURL: updateFilmDto.posterURL,
        },
      });
      return film;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Film already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Film not found');
        }
      }
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.film.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Film not found');
        }
      }
    }
  }

  async addToFavorites(userId: string, filmId: string) {
    const isFilmExist = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favoriteFilms: {
          where: {
            id: filmId,
          },
        },
      },
    });
    if (isFilmExist?.favoriteFilms.length !== 0) {
      throw new ForbiddenException('Film already in favorites');
    }
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          favoriteFilms: {
            connect: {
              id: filmId,
            },
          },
        },
      });
      return {
        message: 'Film added to favorites',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Film not found');
        }
      }
    }
  }

  async removeFromFavorites(userId: string, filmId: string) {
    const isFilmExist = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favoriteFilms: {
          where: {
            id: filmId,
          },
        },
      },
    });
    if (isFilmExist?.favoriteFilms.length === 0) {
      throw new ForbiddenException('Film not in favorites');
    }
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          favoriteFilms: {
            disconnect: {
              id: filmId,
            },
          },
        },
      });
      return {
        message: 'Film removed from favorites',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Film not found');
        }
      }
    }
  }
}
