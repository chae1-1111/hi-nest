import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
    let service: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array', () => {
            const result = service.getAll();
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('getOne', () => {
        it('should return a Movie', () => {
            service.create({
                title: 'Test Movie',
                genres: ['Test'],
                year: 2000,
            });
            const movie = service.getOne(1);
            expect(movie).toBeDefined();
            expect(movie.id).toEqual(1);
        });

        it('should throw 404 error', () => {
            try {
                service.getOne(999);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toEqual('Movie with ID 999 not found.');
            }
        });
    });

    describe('deleteOne', () => {
        it('deletes a movie', () => {
            service.create({
                title: 'Test Movie',
                genres: ['Test'],
                year: 2000,
            });
            const cntAllMovies = service.getAll().length;
            service.deleteOne(1);
            const cntAfterDelete = service.getAll().length;

            expect(cntAfterDelete).toBeLessThan(cntAllMovies);
        });

        it('should throw 404 error', () => {
            try {
                service.deleteOne(999);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });

    describe('create', () => {
        it('should create a new movie', () => {
            const cntBeforeCreate = service.getAll().length;
            service.create({
                title: 'Test Movie',
                genres: ['Test'],
                year: 2000,
            });
            const cntAfterCreate = service.getAll().length;

            expect(cntAfterCreate).toBeGreaterThan(cntBeforeCreate);
        });
    });

    describe('update', () => {
        it('should update a movie', () => {
            service.create({
                title: 'Test Movie',
                genres: ['Test'],
                year: 2000,
            });

            service.update(1, {
                title: 'Updated Movie',
            });

            const updatedMovie = service.getOne(1);

            expect(updatedMovie.title).toEqual('Updated Movie');
        });

        it('should throw 404 error', () => {
            try {
                service.update(999, { title: 'Updated Movie' });
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });
});
