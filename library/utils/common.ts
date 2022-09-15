export const transformRoutes = (routes: any[]) => {
  const list: any[] = [];
  routes
    .filter((it) => it.status !== 0 && it.isMenu !== 0)
    .forEach((it) => {
      const routeItems: any = {
        key: it.id,
        title: it.name,
        name: it.identify,
        path: it.identify,
        meta: {
          order: it.sort,
          locale: `${it.name}`,
          icon: it.icon,
          hideInMenu:
            it.identify === 'user' || it.identify === 'setting' ? true : false,
        },
      };
      if (it.children instanceof Array && it.children.length > 0) {
        routeItems.children = transformRoutes(it.children);
      }
      list.push(routeItems);
    });
  return list;
};