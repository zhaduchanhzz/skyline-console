# AI Assistant (kagent chat)

Feature `kagentchat` nhúng giao diện chat của một kagent **đã triển khai sẵn**
vào Skyline Console bằng iframe. Console không chứa AI, LLM hay API gọi agent;
toàn bộ hội thoại do kagent UI và kagent controller xử lý.

Có hai cách dùng:

- **Widget nổi**: nút tròn ở góc dưới bên phải mọi trang trong console.
- **Trang đầy đủ**: menu **Trợ lý AI** (`/kagentchat/chat`, bản admin là
  `/kagentchat/chat-admin`).

## 1. Phiên bản kagent đã kiểm tra

Route được đối chiếu với source `kagent-dev/kagent`:

| `uiVersion`     | Phiên bản kagent                                         | Chat mới                           | Mở lại hội thoại                        |
| --------------- | -------------------------------------------------------- | ---------------------------------- | --------------------------------------- |
| `v1` (mặc định) | v1.0.x (UI Vite/React Router, `ui/src/router/routes.ts`) | `/agents/{namespace}/{agent}/new`  | `/agents/{id}/chat`                     |
| `v0`            | v0.10.x (UI Next.js, `ui/src/app/agents/...`)            | `/agents/{namespace}/{agent}/chat` | `/agents/{namespace}/{agent}/chat/{id}` |

Ở cả hai phiên bản, kagent chỉ tạo hội thoại khi người dùng **gửi tin nhắn đầu
tiên**, rồi tự thay URL sang id hội thoại. Vì vậy mở/đóng widget không tạo ra
hội thoại rỗng.

## 2. Cấu hình

Cấu hình nằm trong khối `kagent_chat` của **`skyline.yaml` (skyline-apiserver)**
và được đọc **lúc chạy**: apiserver trả nó cùng feature flag qua
`GET /api/v1/features` (chỉ cho người đã đăng nhập). Đổi cấu hình chỉ cần khởi
động lại apiserver; **không phải build lại console**.

Cách ngắn nhất là dán link chat của agent, copy từ kagent:

```yaml
kagent_chat:
  url: https://kagent.openstack.dev/agents/kagent/chat-agent/chat
```

Console tự tách base URL, namespace, agent và phiên bản UI từ link: đuôi `/chat`
là kagent v0.x, đuôi `/new` là kagent v1.x. Cũng có thể khai báo đầy đủ:

```yaml
kagent_chat:
  url: /kagent # base URL của kagent UI
  namespace: kagent
  agent: k8s-agent
  ui_version: v1 # v1 (mặc định) | v0
  allowed_roles: [] # tuỳ chọn
```

| Khóa                 | Ý nghĩa                                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `url`                | Bắt buộc. Link chat của agent, hoặc base URL của kagent UI. Nên dùng đường dẫn cùng origin (`/kagent`, qua reverse proxy ở mục 4). URL có user/password, query hoặc fragment, `//host`, `javascript:`... đều bị từ chối. |
| `namespace`, `agent` | Bắt buộc khi `url` là base URL. Namespace và tên resource `Agent` đã có trong cluster. Khi `url` là link chat, nếu khai báo thì phải khớp với link.                                                                      |
| `ui_version`         | Chọn bảng route ở mục 1. Khi `url` là link chat, nếu khai báo thì phải khớp với đuôi link.                                                                                                                               |
| `allowed_roles`      | Danh sách tên role Keystone được thấy tính năng. Để trống thì mọi người dùng đã đăng nhập đều thấy. Đây chỉ là lớp ẩn giao diện, **không phải lớp bảo mật** (xem mục 5).                                                 |

Apiserver kiểm tra kiểu dữ liệu và từ chối khởi động khi khối này sai rõ ràng
(khóa lạ, `url` không phải http(s) hay đường dẫn, `ui_version` khác `v0`/`v1`).
Console kiểm tra lại URL và tên trước khi dùng.

Hành vi theo trạng thái cấu hình:

- **Không có `kagent_chat`**: menu và widget đều ẩn. Truy cập thẳng URL trang
  chat sẽ thấy thông báo "Trợ lý AI chưa được cấu hình".
- **Cấu hình sai**: menu và widget vẫn hiện, nhưng hiển thị lỗi cấu hình kèm lý do.
- Người dùng **không có trong `allowed_roles`**: menu và widget ẩn, trang chat
  báo không có quyền.
- Skyline-apiserver bản gốc (chưa có `kagent_chat`): tính năng ẩn.

Người dùng không sửa được URL của iframe. Tham số duy nhất đọc từ URL của
console là `?session=` trên trang chat, và tham số này chỉ nhận các ký tự
`[A-Za-z0-9_-]`.

Khi chạy console bằng `npm run local` (mock API, không có apiserver), mock
cũng đọc `features` và `kagent_chat` từ
`../skyline-apiserver/etc/skyline.yaml` (đọc lại mỗi request, sửa xong chỉ cần
tải lại trang). Dùng file khác bằng biến môi trường `SKYLINE_YAML`:

```sh
SKYLINE_YAML=/etc/skyline/skyline.yaml npm run local
```

Chỉ khi không tìm thấy file đó, mock mới dùng khối `localMock` trong
`config/local_config.yaml`.

## 3. Bật/tắt bằng feature flag

Khóa `kagentchat` đã được khai báo trong `src/resources/skyline/features.json`
với `paths: ["/kagentchat"]`. Muốn tắt, sửa `skyline.yaml` của
skyline-apiserver rồi khởi động lại apiserver:

```yaml
features: { kagentchat: false }
```

Khi tắt:

- menu bị ẩn (`filterFeatureMenu`);
- widget bị ẩn;
- `/kagentchat/chat` và `/kagentchat/chat-admin` hiển thị "Không thể hiển thị mục này." (`Right.jsx`).

Khi không đặt giá trị nào, tính năng được bật nếu đã có `kagent_chat`.

## 4. Reverse proxy cùng origin (khuyến nghị)

Cấu hình kagent dùng base path:

```yaml
# values của Helm chart kagent
ui:
  basePath: /kagent
```

Thêm vào nginx phục vụ Skyline (file sinh từ
`skyline_apiserver/templates/nginx.conf.j2`, nằm ngoài repo này):

```nginx
location /kagent/ {
    # Chỉ cho người đã có phiên Skyline hợp lệ (mục 5).
    auth_request /_skyline_auth;

    proxy_pass http://kagent-ui.kagent.svc.cluster.local:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;          # /a2a dùng SSE
    proxy_read_timeout 3600s;
}

location = /_skyline_auth {
    internal;
    proxy_pass http://127.0.0.1:9999/api/openstack/skyline/api/v1/profile;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Cookie $http_cookie;
}
```

Lý do nên dùng cùng origin:

- không phải xử lý CORS, cookie bên thứ ba hay `frame-ancestors` giữa hai domain;
- nút "Mở toàn trang" giữ được hội thoại đang mở (mục 6).

Đánh đổi: khi kagent chạy cùng origin, mã JavaScript của kagent UI có quyền
như chính Skyline (đọc được DOM và cookie không có `HttpOnly` của console).
Thuộc tính `sandbox` của iframe không còn tác dụng cách ly khi có cả
`allow-scripts` và `allow-same-origin`. Chỉ nhúng bản kagent mà bạn tin cậy.
Nếu cần cách ly mạnh hơn, hãy dùng một domain riêng
(`url: https://kagent.example.com`) và chấp nhận không chuyển được hội thoại
sang trang đầy đủ.

## 5. Bảo mật: những việc phải làm ngoài console

Feature flag và `allowed_roles` chỉ ẩn giao diện. Kiểm soát thật phải đặt ở
proxy và ở kagent:

1. **Chặn truy cập kagent khi chưa đăng nhập Skyline**: dùng `auth_request` ở
   mục 4. `/profile` trả 401 nếu cookie phiên Skyline không hợp lệ.
2. **kagent mặc định chạy `config.server.auth.mode: insecure`**: mọi request
   được coi là `admin@kagent.dev`, nghĩa là **tất cả người dùng dùng chung một
   danh sách hội thoại**. Muốn tách hội thoại theo người dùng, phải có thành
   phần xác thực gắn danh tính thật:

   - chạy kagent ở chế độ `trusted-proxy` sau oauth2-proxy/OIDC; hoặc
   - dùng một auth shim đặt header `X-User-Id` từ phiên Skyline.

   Không thể đặt `X-User-Id` chỉ bằng `auth_request` như ở mục 4, vì `/profile`
   trả danh tính trong body chứ không trong header. Việc này **chưa được làm**
   trong repo này.

3. **kagent UI không có chế độ chat-only.** Trong iframe vẫn có sidebar
   Dashboard, Agents, Models, MCP Servers, Policies... Nếu chưa phân quyền ở
   kagent, người dùng Skyline có thể sửa agent và model. Hãy giới hạn ở proxy,
   hoặc bật RBAC/xác thực của kagent trước khi mở tính năng cho người dùng
   thường. Console không dùng CSS để can thiệp vào iframe.
4. **Chống nhúng trái phép**: kagent v1.0.1 không đặt `X-Frame-Options` hay CSP.
   Nên thêm vào location `/kagent/`:

   ```nginx
   add_header Content-Security-Policy "frame-ancestors 'self'" always;
   ```

   Với domain riêng, thay `'self'` bằng origin của Skyline. Nếu kagent hoặc
   ingress gửi `X-Frame-Options: DENY`, iframe sẽ bị trình duyệt chặn.

5. Không đưa token hay API key vào `kagent_chat`: mọi giá trị trong khối này
   được gửi xuống trình duyệt của người dùng đã đăng nhập.
6. Iframe dùng `sandbox` không có `allow-top-navigation`, nên kagent không thể
   điều hướng trang Skyline. Console không dùng `postMessage` (kagent cũng
   không gửi).

## 6. Duy trì hội thoại

- **Widget** chỉ tạo iframe ở lần mở đầu tiên. Đóng widget chỉ ẩn iframe, nên
  hội thoại vẫn còn khi mở lại và khi chuyển trang trong console. Tải lại cả
  trang trình duyệt thì widget quay về "chat mới".
- **Mở toàn trang**: khi kagent chạy cùng origin, widget đọc id hội thoại từ URL
  của iframe và mở `/kagentchat/chat?session=<id>` với đúng hội thoại đó. Khi
  khác origin, trình duyệt không cho đọc URL iframe, nên trang đầy đủ mở chat
  mới; hội thoại cũ vẫn xem được trong danh sách hội thoại của kagent.
- **Trang đầy đủ** tải lại được, và `?session=` vẫn được giữ. Hội thoại tạo mới
  trên trang đầy đủ không được ghi ngược vào URL console, nên F5 sẽ mở chat mới.
- Widget và trang đầy đủ là hai iframe riêng. Cùng một hội thoại mở ở cả hai nơi
  không tự đồng bộ theo thời gian thực; đó là hành vi của kagent UI.

## 7. Build và triển khai

```bash
npm run build          # Windows: npm run build:win
```

Bundle được ghi vào `skyline_console/static` và sinh thêm chunk
`kagentchat.bundle.*.js`. Phần còn lại của console không tải chunk này cho tới
khi người dùng mở trang chat. Đổi `kagent_chat` không cần build lại (mục 2).

## 8. Kiểm tra sau triển khai

1. Đăng nhập Skyline: có menu **Trợ lý AI** và nút nổi góc dưới phải.
2. Mở widget, gửi tin nhắn, nhận được phản hồi từ agent.
3. Đóng rồi mở lại widget, chuyển sang trang khác: hội thoại vẫn còn.
4. Bấm "Mở toàn trang": nếu cùng origin, cùng hội thoại xuất hiện; widget không
   hiện trên trang này.
5. F12 → Console/Network: không có lỗi CSP, `X-Frame-Options`, 401/403 hay CORS.
6. Đặt `features: {kagentchat: false}`: menu và widget biến mất,
   `/kagentchat/chat` bị chặn.
7. Mở `https://<skyline>/kagent/` trong cửa sổ ẩn danh: phải bị chặn (401) nếu
   đã cấu hình `auth_request`.

## 9. Giới hạn đã biết

- kagent UI không có chế độ nhúng hay chat-only. Đầy đủ giao diện quản trị kagent
  hiển thị trong iframe.
- Khi kagent không chạy được hoặc từ chối nhúng, Chrome vẫn bắn sự kiện `load`
  cho trang lỗi. Khi đó iframe hiển thị trang lỗi của trình duyệt thay vì thông
  báo của console. Thông báo "phản hồi quá lâu" chỉ xuất hiện khi request bị treo
  quá 20 giây.
- Nếu kagent bật đăng nhập SSO (oauth2-proxy), trang đăng nhập của IdP thường cấm
  nhúng iframe. Người dùng phải đăng nhập kagent ở tab riêng trước. SSO dùng
  chung với Keystone chưa được tích hợp.
- Tách hội thoại theo người dùng phụ thuộc vào cấu hình xác thực của kagent
  (mục 5.2).
- Cấu hình cần skyline-apiserver có hỗ trợ `kagent_chat` (đã thêm trong repo
  skyline-apiserver đi kèm). Với apiserver bản gốc, tính năng bị ẩn.
- kagent v0.10.x hiện wizard "Let's get you started" ở lần mở đầu tiên trên mỗi
  trình duyệt (lưu cờ `kagent-onboarding` trong localStorage của origin kagent),
  kể cả khi nằm trong iframe. Người dùng phải bấm "Skip wizard" một lần.
- Chứng chỉ HTTPS của kagent phải được trình duyệt tin cậy. Với CA nội bộ, phải
  cài root CA vào máy người dùng; iframe không cho phép bấm "tiếp tục" qua cảnh
  báo chứng chỉ.
