const transformRoutes = (routes: any[]) => {
  const list: any[] = [];
  routes
    .filter((it) => it.status !== 0)
    .forEach((it) => {
      const routeItems: any = {
        key: it.id,
        title: it.name,
        name: it.identify,
        path: '/' + it.identify,
        type: it.type,
        uri: it.uri,
        identify: it.identify,
        appName: it.appName,
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

type TargetContext = '_self' | '_parent' | '_blank' | '_top';

const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any }
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(',')
  );
};

export default {transformRoutes,  openWindow}