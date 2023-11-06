export let items: Map<string, CatalogItemType> = new Map();
// items.set('Cube', { code: 1 });
// items.set('Cylinder', { code: 2 });
// items.set('Sphere', { code: 3 });
// items.set('Model', { code: 4 });
// items.set('Model2', { code: 5 });

export interface CatalogItemType {
    id: string
    v:  number // version
    im: string // image
    n:  string
    objName: string
}