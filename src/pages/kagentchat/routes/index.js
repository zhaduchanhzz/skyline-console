import BaseLayout from 'layouts/Basic';
import E404 from 'pages/base/containers/404';
import Chat from '../containers/Chat';

const PATH = '/kagentchat';
export default [
  {
    path: PATH,
    component: BaseLayout,
    routes: [
      { path: `${PATH}/chat`, component: Chat, exact: true },
      { path: `${PATH}/chat-admin`, component: Chat, exact: true },
      { path: '*', component: E404 },
    ],
  },
];
