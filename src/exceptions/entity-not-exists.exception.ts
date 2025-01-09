export class EntityNotExistsError extends Error {
    entity: string;
    constructor(entity: string) {
        super(`not find ${entity}`);
        this.entity = entity;
    }
}