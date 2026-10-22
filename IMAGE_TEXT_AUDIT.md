# Trạng thái logo hiện tại và kiểm kê lịch sử

## Logo MBFS hiện tại

- Trang đăng nhập hiển thị logo MBFS trong [Auth layout](src/layouts/Auth/index.jsx); thanh điều hướng sau đăng nhập hiển thị cùng logo trong [GlobalHeader](src/components/Layout/GlobalHeader/index.jsx).
- File nguồn là [src/asset/image/mbfs-logo.svg](src/asset/image/mbfs-logo.svg). Bản build đã chứa [skyline_console/static/asset/image/mbfs-logo.svg](skyline_console/static/asset/image/mbfs-logo.svg); [webpack.common.js](config/webpack.common.js) xuất SVG này với tên cố định.
- Các file `cloud-logo.svg`, `cloud-logo-white.svg`, `logo.png` và `loginRightLogo.png` vẫn còn trong thư mục nguồn nhưng không còn được hai thành phần giao diện trên sử dụng. Bản build hiện tại không chứa các file logo cũ đó trong `skyline_console/static/asset/image/`.
- Tên sản phẩm trong tiêu đề trang và lời chào vẫn là Sovereign Next; thay đổi này áp dụng cho hình logo MBFS.

## Kiểm kê lịch sử trước khi đổi logo MBFS

Phần dưới ghi lại kết quả khảo sát cũ. Số lượng ảnh, đường dẫn trong bản build và mô tả vị trí hiển thị ở phần này **không phản ánh giao diện hiện tại**; một số liên kết tới file build cũ có thể không còn tồn tại.

Đã kiểm tra trực quan 289 ảnh trong repository (kể cả SVG được vẽ bằng path và các bản build). Có **228 ảnh chứa từ đọc được**: 218 ảnh tài liệu, 6 ảnh nguồn ứng dụng và 4 bản sao trong bản build. Biểu tượng đơn lẻ không được tính là chữ.

| Khu vực                   | Ảnh có chữ | Tổng ảnh |
| ------------------------- | ---------: | -------: |
| `docs/`                   |        218 |      224 |
| `src/asset/image/`        |          6 |       51 |
| `skyline_console/static/` |          4 |       13 |
| `test/`                   |          0 |        1 |

### Ảnh ứng dụng có chữ

| File                                                                                                                 | Chữ nhìn thấy          | Vai trò                                        |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------- |
| [src/asset/image/cloud-logo.svg](src/asset/image/cloud-logo.svg)                                                     | `rackspace`            | Logo header, theme mặc định                    |
| [src/asset/image/cloud-logo-white.svg](src/asset/image/cloud-logo-white.svg)                                         | `rackspace technology` | Logo header, theme khác                        |
| [src/asset/image/logo.png](src/asset/image/logo.png)                                                                 | `rackspace technology` | Logo form đăng nhập                            |
| [src/asset/image/loginRightLogo.png](src/asset/image/loginRightLogo.png)                                             | `rackspace technology` | Logo chữ trắng; cấu hình webpack có tham chiếu |
| [src/asset/image/flatcar.svg](src/asset/image/flatcar.svg)                                                           | `FLAT CAR`             | Logo hệ điều hành                              |
| [src/asset/image/oracle.svg](src/asset/image/oracle.svg)                                                             | `ORACLE Linux`         | Logo hệ điều hành                              |
| [skyline_console/static/asset/image/cloud-logo.svg](skyline_console/static/asset/image/cloud-logo.svg)               | `rackspace`            | Bản build, trùng byte với nguồn                |
| [skyline_console/static/asset/image/cloud-logo-white.svg](skyline_console/static/asset/image/cloud-logo-white.svg)   | `rackspace technology` | Bản build, trùng byte với nguồn                |
| [skyline_console/static/asset/image/logo.png](skyline_console/static/asset/image/logo.png)                           | `rackspace technology` | Bản build, trùng byte với nguồn                |
| [skyline_console/static/asset/image/oracle.1791533518.svg](skyline_console/static/asset/image/oracle.1791533518.svg) | `ORACLE Linux`         | Bản build, trùng byte với nguồn                |

Tại thời điểm kiểm kê cũ, vị trí hiển thị logo là: [GlobalHeader](src/components/Layout/GlobalHeader/index.jsx) dòng 17–18, 37–46 chọn hai `cloud-logo` theo theme; [Login](src/pages/auth/containers/Login/index.jsx) dòng 26, 635–639 dùng `logo.png`. [webpack.common.js](config/webpack.common.js) dòng 54–55, 71–72 có tham chiếu `loginRightLogo.png`.

### Ảnh chỉ có biểu tượng Rackspace, không có chữ

- [src/asset/image/favicon.ico](src/asset/image/favicon.ico) và [skyline_console/static/favicon.ico](skyline_console/static/favicon.ico).
- [src/asset/image/openstack-new-logo.png](src/asset/image/openstack-new-logo.png), [src/asset/image/openstack-new-logo.webp](src/asset/image/openstack-new-logo.webp), [bản PNG đã build](skyline_console/static/asset/image/openstack-new-logo.1791533518.png), [bản WebP đã build](skyline_console/static/asset/image/openstack-new-logo.1791533518.webp). Biểu tượng này được dùng ở [Auth](src/layouts/Auth/index.jsx) dòng 29–30, 192–198; dòng chữ “Rackspace OpenStack” bên cạnh nằm trong JSX dòng 203–205.

### Ảnh tài liệu có chữ

Có 218 ảnh PNG trong `docs/` chứa chữ giao diện, mã hoặc kết quả kiểm thử. Không thấy chữ Rackspace trong các ảnh này; ảnh giao diện cũ dùng logo Animbus. Sáu PNG chỉ có biểu tượng, không có chữ, là `download.png`, `fresh.png`, `stop-auto-refresh.png` ở cả hai thư mục `docs/en/develop/images/list/` và `docs/zh/develop/images/list/`.

<details>
<summary>Danh sách đầy đủ 218 ảnh tài liệu có chữ</summary>

- [docs/en/develop/images/detail/image-detail-info.png](docs/en/develop/images/detail/image-detail-info.png)
- [docs/en/develop/images/detail/volume.png](docs/en/develop/images/detail/volume.png)
- [docs/en/develop/images/form/create-success.png](docs/en/develop/images/form/create-success.png)
- [docs/en/develop/images/form/page.png](docs/en/develop/images/form/page.png)
- [docs/en/develop/images/list/batch.png](docs/en/develop/images/list/batch.png)
- [docs/en/develop/images/list/hide.png](docs/en/develop/images/list/hide.png)
- [docs/en/develop/images/list/pagination.png](docs/en/develop/images/list/pagination.png)
- [docs/en/develop/images/list/search-example.png](docs/en/develop/images/list/search-example.png)
- [docs/en/develop/images/list/search.png](docs/en/develop/images/list/search.png)
- [docs/en/develop/images/list/tab-list.png](docs/en/develop/images/list/tab-list.png)
- [docs/en/develop/images/list/tab-service.png](docs/en/develop/images/list/tab-service.png)
- [docs/en/develop/images/list/volumes.png](docs/en/develop/images/list/volumes.png)
- [docs/en/develop/images/store/response-key.png](docs/en/develop/images/store/response-key.png)
- [docs/en/test/images/e2e/console.png](docs/en/test/images/e2e/console.png)
- [docs/en/test/images/e2e/detail/list.png](docs/en/test/images/e2e/detail/list.png)
- [docs/en/test/images/e2e/detail/name.png](docs/en/test/images/e2e/detail/name.png)
- [docs/en/test/images/e2e/detail/tab.png](docs/en/test/images/e2e/detail/tab.png)
- [docs/en/test/images/e2e/form/add-select.png](docs/en/test/images/e2e/form/add-select.png)
- [docs/en/test/images/e2e/form/attach-file-image.png](docs/en/test/images/e2e/form/attach-file-image.png)
- [docs/en/test/images/e2e/form/attach-file.png](docs/en/test/images/e2e/form/attach-file.png)
- [docs/en/test/images/e2e/form/checkbox.png](docs/en/test/images/e2e/form/checkbox.png)
- [docs/en/test/images/e2e/form/click-confirm-submit.png](docs/en/test/images/e2e/form/click-confirm-submit.png)
- [docs/en/test/images/e2e/form/click-form-submit.png](docs/en/test/images/e2e/form/click-form-submit.png)
- [docs/en/test/images/e2e/form/click-modal-submit.png](docs/en/test/images/e2e/form/click-modal-submit.png)
- [docs/en/test/images/e2e/form/click-step-next.png](docs/en/test/images/e2e/form/click-step-next.png)
- [docs/en/test/images/e2e/form/disable-action.png](docs/en/test/images/e2e/form/disable-action.png)
- [docs/en/test/images/e2e/form/form-name.png](docs/en/test/images/e2e/form/form-name.png)
- [docs/en/test/images/e2e/form/input.png](docs/en/test/images/e2e/form/input.png)
- [docs/en/test/images/e2e/form/key-value.png](docs/en/test/images/e2e/form/key-value.png)
- [docs/en/test/images/e2e/form/more-open.png](docs/en/test/images/e2e/form/more-open.png)
- [docs/en/test/images/e2e/form/more.png](docs/en/test/images/e2e/form/more.png)
- [docs/en/test/images/e2e/form/notice.png](docs/en/test/images/e2e/form/notice.png)
- [docs/en/test/images/e2e/form/radio.png](docs/en/test/images/e2e/form/radio.png)
- [docs/en/test/images/e2e/form/select-all.png](docs/en/test/images/e2e/form/select-all.png)
- [docs/en/test/images/e2e/form/select-table-option.png](docs/en/test/images/e2e/form/select-table-option.png)
- [docs/en/test/images/e2e/form/select-table-search.png](docs/en/test/images/e2e/form/select-table-search.png)
- [docs/en/test/images/e2e/form/select-table.png](docs/en/test/images/e2e/form/select-table.png)
- [docs/en/test/images/e2e/form/select-value.png](docs/en/test/images/e2e/form/select-value.png)
- [docs/en/test/images/e2e/form/select.png](docs/en/test/images/e2e/form/select.png)
- [docs/en/test/images/e2e/form/switch.png](docs/en/test/images/e2e/form/switch.png)
- [docs/en/test/images/e2e/form/tab.png](docs/en/test/images/e2e/form/tab.png)
- [docs/en/test/images/e2e/form/textarea-json.png](docs/en/test/images/e2e/form/textarea-json.png)
- [docs/en/test/images/e2e/form/transfer-left-click.png](docs/en/test/images/e2e/form/transfer-left-click.png)
- [docs/en/test/images/e2e/form/transfer-left.png](docs/en/test/images/e2e/form/transfer-left.png)
- [docs/en/test/images/e2e/form/transfer-right-check.png](docs/en/test/images/e2e/form/transfer-right-check.png)
- [docs/en/test/images/e2e/form/transfer-right.png](docs/en/test/images/e2e/form/transfer-right.png)
- [docs/en/test/images/e2e/form/unselect-all.png](docs/en/test/images/e2e/form/unselect-all.png)
- [docs/en/test/images/e2e/form/wait-form-loading.png](docs/en/test/images/e2e/form/wait-form-loading.png)
- [docs/en/test/images/e2e/gui-list.png](docs/en/test/images/e2e/gui-list.png)
- [docs/en/test/images/e2e/gui-work.png](docs/en/test/images/e2e/gui-work.png)
- [docs/en/test/images/e2e/result.png](docs/en/test/images/e2e/result.png)
- [docs/en/test/images/e2e/table/action-by-title-2.png](docs/en/test/images/e2e/table/action-by-title-2.png)
- [docs/en/test/images/e2e/table/action-by-title.png](docs/en/test/images/e2e/table/action-by-title.png)
- [docs/en/test/images/e2e/table/action-in-more.png](docs/en/test/images/e2e/table/action-in-more.png)
- [docs/en/test/images/e2e/table/action-in-sub.png](docs/en/test/images/e2e/table/action-in-sub.png)
- [docs/en/test/images/e2e/table/check-first-row.png](docs/en/test/images/e2e/table/check-first-row.png)
- [docs/en/test/images/e2e/table/check-value.png](docs/en/test/images/e2e/table/check-value.png)
- [docs/en/test/images/e2e/table/click-first.png](docs/en/test/images/e2e/table/click-first.png)
- [docs/en/test/images/e2e/table/confirm-action.png](docs/en/test/images/e2e/table/confirm-action.png)
- [docs/en/test/images/e2e/table/confirm-in-sub.png](docs/en/test/images/e2e/table/confirm-in-sub.png)
- [docs/en/test/images/e2e/table/confirm-more-1.png](docs/en/test/images/e2e/table/confirm-more-1.png)
- [docs/en/test/images/e2e/table/confirm-more-2.png](docs/en/test/images/e2e/table/confirm-more-2.png)
- [docs/en/test/images/e2e/table/detail-1.png](docs/en/test/images/e2e/table/detail-1.png)
- [docs/en/test/images/e2e/table/detail-2.png](docs/en/test/images/e2e/table/detail-2.png)
- [docs/en/test/images/e2e/table/disable-first.png](docs/en/test/images/e2e/table/disable-first.png)
- [docs/en/test/images/e2e/table/disable-more-action.png](docs/en/test/images/e2e/table/disable-more-action.png)
- [docs/en/test/images/e2e/table/first-confirm-2.png](docs/en/test/images/e2e/table/first-confirm-2.png)
- [docs/en/test/images/e2e/table/first-confirm.png](docs/en/test/images/e2e/table/first-confirm.png)
- [docs/en/test/images/e2e/table/header-btn-index.png](docs/en/test/images/e2e/table/header-btn-index.png)
- [docs/en/test/images/e2e/table/header-btn-title.png](docs/en/test/images/e2e/table/header-btn-title.png)
- [docs/en/test/images/e2e/table/header-confirm-title.png](docs/en/test/images/e2e/table/header-confirm-title.png)
- [docs/en/test/images/e2e/table/search-select-1.png](docs/en/test/images/e2e/table/search-select-1.png)
- [docs/en/test/images/e2e/table/search-select-2.png](docs/en/test/images/e2e/table/search-select-2.png)
- [docs/en/test/images/e2e/table/search-select-3.png](docs/en/test/images/e2e/table/search-select-3.png)
- [docs/en/test/images/e2e/table/search-text-1.png](docs/en/test/images/e2e/table/search-text-1.png)
- [docs/en/test/images/e2e/table/search-text-2.png](docs/en/test/images/e2e/table/search-text-2.png)
- [docs/en/test/images/e2e/table/search-text-3.png](docs/en/test/images/e2e/table/search-text-3.png)
- [docs/en/test/images/e2e/table/search.png](docs/en/test/images/e2e/table/search.png)
- [docs/en/test/images/e2e/table/select-first.png](docs/en/test/images/e2e/table/select-first.png)
- [docs/en/test/images/e2e/table/simple-search.png](docs/en/test/images/e2e/table/simple-search.png)
- [docs/en/test/images/e2e/table/wait-1.png](docs/en/test/images/e2e/table/wait-1.png)
- [docs/en/test/images/e2e/table/wait-2.png](docs/en/test/images/e2e/table/wait-2.png)
- [docs/en/test/images/e2e/table/wait-table-loading.png](docs/en/test/images/e2e/table/wait-table-loading.png)
- [docs/en/test/images/unit/result.png](docs/en/test/images/unit/result.png)
- [docs/zh/develop/images/detail/image-detail-info.png](docs/zh/develop/images/detail/image-detail-info.png)
- [docs/zh/develop/images/detail/volume.png](docs/zh/develop/images/detail/volume.png)
- [docs/zh/develop/images/form/ace-editor.png](docs/zh/develop/images/form/ace-editor.png)
- [docs/zh/develop/images/form/action.png](docs/zh/develop/images/form/action.png)
- [docs/zh/develop/images/form/add-select.png](docs/zh/develop/images/form/add-select.png)
- [docs/zh/develop/images/form/check-group.png](docs/zh/develop/images/form/check-group.png)
- [docs/zh/develop/images/form/check.png](docs/zh/develop/images/form/check.png)
- [docs/zh/develop/images/form/confirm.png](docs/zh/develop/images/form/confirm.png)
- [docs/zh/develop/images/form/create-success.png](docs/zh/develop/images/form/create-success.png)
- [docs/zh/develop/images/form/descriptions.png](docs/zh/develop/images/form/descriptions.png)
- [docs/zh/develop/images/form/form-divider.png](docs/zh/develop/images/form/form-divider.png)
- [docs/zh/develop/images/form/form-extra.png](docs/zh/develop/images/form/form-extra.png)
- [docs/zh/develop/images/form/form-label.png](docs/zh/develop/images/form/form-label.png)
- [docs/zh/develop/images/form/form-tip.png](docs/zh/develop/images/form/form-tip.png)
- [docs/zh/develop/images/form/input-int.png](docs/zh/develop/images/form/input-int.png)
- [docs/zh/develop/images/form/input-json.png](docs/zh/develop/images/form/input-json.png)
- [docs/zh/develop/images/form/input-name.png](docs/zh/develop/images/form/input-name.png)
- [docs/zh/develop/images/form/input-number.png](docs/zh/develop/images/form/input-number.png)
- [docs/zh/develop/images/form/input-password.png](docs/zh/develop/images/form/input-password.png)
- [docs/zh/develop/images/form/input.png](docs/zh/develop/images/form/input.png)
- [docs/zh/develop/images/form/instance-action.png](docs/zh/develop/images/form/instance-action.png)
- [docs/zh/develop/images/form/instance-volume.png](docs/zh/develop/images/form/instance-volume.png)
- [docs/zh/develop/images/form/ip-distributer.png](docs/zh/develop/images/form/ip-distributer.png)
- [docs/zh/develop/images/form/ip-input.png](docs/zh/develop/images/form/ip-input.png)
- [docs/zh/develop/images/form/label-col.png](docs/zh/develop/images/form/label-col.png)
- [docs/zh/develop/images/form/mac-address.png](docs/zh/develop/images/form/mac-address.png)
- [docs/zh/develop/images/form/member-allocator.png](docs/zh/develop/images/form/member-allocator.png)
- [docs/zh/develop/images/form/metadata-transfer.png](docs/zh/develop/images/form/metadata-transfer.png)
- [docs/zh/develop/images/form/modal.png](docs/zh/develop/images/form/modal.png)
- [docs/zh/develop/images/form/more.png](docs/zh/develop/images/form/more.png)
- [docs/zh/develop/images/form/network-select-table.png](docs/zh/develop/images/form/network-select-table.png)
- [docs/zh/develop/images/form/network-select.png](docs/zh/develop/images/form/network-select.png)
- [docs/zh/develop/images/form/page.png](docs/zh/develop/images/form/page.png)
- [docs/zh/develop/images/form/port-range.png](docs/zh/develop/images/form/port-range.png)
- [docs/zh/develop/images/form/radio.png](docs/zh/develop/images/form/radio.png)
- [docs/zh/develop/images/form/select-table-tabs.png](docs/zh/develop/images/form/select-table-tabs.png)
- [docs/zh/develop/images/form/select-table.png](docs/zh/develop/images/form/select-table.png)
- [docs/zh/develop/images/form/select.png](docs/zh/develop/images/form/select.png)
- [docs/zh/develop/images/form/slider-input.png](docs/zh/develop/images/form/slider-input.png)
- [docs/zh/develop/images/form/step.png](docs/zh/develop/images/form/step.png)
- [docs/zh/develop/images/form/switch.png](docs/zh/develop/images/form/switch.png)
- [docs/zh/develop/images/form/tab-select-table.png](docs/zh/develop/images/form/tab-select-table.png)
- [docs/zh/develop/images/form/textarea-from-file.png](docs/zh/develop/images/form/textarea-from-file.png)
- [docs/zh/develop/images/form/textarea.png](docs/zh/develop/images/form/textarea.png)
- [docs/zh/develop/images/form/title.png](docs/zh/develop/images/form/title.png)
- [docs/zh/develop/images/form/transfer.png](docs/zh/develop/images/form/transfer.png)
- [docs/zh/develop/images/form/upload.png](docs/zh/develop/images/form/upload.png)
- [docs/zh/develop/images/form/volume-action.png](docs/zh/develop/images/form/volume-action.png)
- [docs/zh/develop/images/form/volume-select-table.png](docs/zh/develop/images/form/volume-select-table.png)
- [docs/zh/develop/images/form/wrapper-col.png](docs/zh/develop/images/form/wrapper-col.png)
- [docs/zh/develop/images/i18n/english.png](docs/zh/develop/images/i18n/english.png)
- [docs/zh/develop/images/i18n/i18n.png](docs/zh/develop/images/i18n/i18n.png)
- [docs/zh/develop/images/list/batch.png](docs/zh/develop/images/list/batch.png)
- [docs/zh/develop/images/list/hide.png](docs/zh/develop/images/list/hide.png)
- [docs/zh/develop/images/list/pagination.png](docs/zh/develop/images/list/pagination.png)
- [docs/zh/develop/images/list/search-example.png](docs/zh/develop/images/list/search-example.png)
- [docs/zh/develop/images/list/search.png](docs/zh/develop/images/list/search.png)
- [docs/zh/develop/images/list/tab-list.png](docs/zh/develop/images/list/tab-list.png)
- [docs/zh/develop/images/list/tab-service.png](docs/zh/develop/images/list/tab-service.png)
- [docs/zh/develop/images/list/volumes.png](docs/zh/develop/images/list/volumes.png)
- [docs/zh/develop/images/menu/admin-menu.png](docs/zh/develop/images/menu/admin-menu.png)
- [docs/zh/develop/images/menu/console-menu.png](docs/zh/develop/images/menu/console-menu.png)
- [docs/zh/develop/images/store/response-key.png](docs/zh/develop/images/store/response-key.png)
- [docs/zh/test/images/e2e/console.png](docs/zh/test/images/e2e/console.png)
- [docs/zh/test/images/e2e/detail/list.png](docs/zh/test/images/e2e/detail/list.png)
- [docs/zh/test/images/e2e/detail/name.png](docs/zh/test/images/e2e/detail/name.png)
- [docs/zh/test/images/e2e/detail/tab.png](docs/zh/test/images/e2e/detail/tab.png)
- [docs/zh/test/images/e2e/form/add-select.png](docs/zh/test/images/e2e/form/add-select.png)
- [docs/zh/test/images/e2e/form/attach-file-image.png](docs/zh/test/images/e2e/form/attach-file-image.png)
- [docs/zh/test/images/e2e/form/attach-file.png](docs/zh/test/images/e2e/form/attach-file.png)
- [docs/zh/test/images/e2e/form/checkbox.png](docs/zh/test/images/e2e/form/checkbox.png)
- [docs/zh/test/images/e2e/form/click-confirm-submit.png](docs/zh/test/images/e2e/form/click-confirm-submit.png)
- [docs/zh/test/images/e2e/form/click-form-submit.png](docs/zh/test/images/e2e/form/click-form-submit.png)
- [docs/zh/test/images/e2e/form/click-modal-submit.png](docs/zh/test/images/e2e/form/click-modal-submit.png)
- [docs/zh/test/images/e2e/form/click-step-next.png](docs/zh/test/images/e2e/form/click-step-next.png)
- [docs/zh/test/images/e2e/form/disable-action.png](docs/zh/test/images/e2e/form/disable-action.png)
- [docs/zh/test/images/e2e/form/form-name.png](docs/zh/test/images/e2e/form/form-name.png)
- [docs/zh/test/images/e2e/form/input.png](docs/zh/test/images/e2e/form/input.png)
- [docs/zh/test/images/e2e/form/key-value.png](docs/zh/test/images/e2e/form/key-value.png)
- [docs/zh/test/images/e2e/form/more-open.png](docs/zh/test/images/e2e/form/more-open.png)
- [docs/zh/test/images/e2e/form/more.png](docs/zh/test/images/e2e/form/more.png)
- [docs/zh/test/images/e2e/form/notice.png](docs/zh/test/images/e2e/form/notice.png)
- [docs/zh/test/images/e2e/form/radio.png](docs/zh/test/images/e2e/form/radio.png)
- [docs/zh/test/images/e2e/form/select-all.png](docs/zh/test/images/e2e/form/select-all.png)
- [docs/zh/test/images/e2e/form/select-table-option.png](docs/zh/test/images/e2e/form/select-table-option.png)
- [docs/zh/test/images/e2e/form/select-table-search.png](docs/zh/test/images/e2e/form/select-table-search.png)
- [docs/zh/test/images/e2e/form/select-table.png](docs/zh/test/images/e2e/form/select-table.png)
- [docs/zh/test/images/e2e/form/select-value.png](docs/zh/test/images/e2e/form/select-value.png)
- [docs/zh/test/images/e2e/form/select.png](docs/zh/test/images/e2e/form/select.png)
- [docs/zh/test/images/e2e/form/switch.png](docs/zh/test/images/e2e/form/switch.png)
- [docs/zh/test/images/e2e/form/tab.png](docs/zh/test/images/e2e/form/tab.png)
- [docs/zh/test/images/e2e/form/textarea-json.png](docs/zh/test/images/e2e/form/textarea-json.png)
- [docs/zh/test/images/e2e/form/transfer-left-click.png](docs/zh/test/images/e2e/form/transfer-left-click.png)
- [docs/zh/test/images/e2e/form/transfer-left.png](docs/zh/test/images/e2e/form/transfer-left.png)
- [docs/zh/test/images/e2e/form/transfer-right-check.png](docs/zh/test/images/e2e/form/transfer-right-check.png)
- [docs/zh/test/images/e2e/form/transfer-right.png](docs/zh/test/images/e2e/form/transfer-right.png)
- [docs/zh/test/images/e2e/form/unselect-all.png](docs/zh/test/images/e2e/form/unselect-all.png)
- [docs/zh/test/images/e2e/form/wait-form-loading.png](docs/zh/test/images/e2e/form/wait-form-loading.png)
- [docs/zh/test/images/e2e/gui-list.png](docs/zh/test/images/e2e/gui-list.png)
- [docs/zh/test/images/e2e/gui-work.png](docs/zh/test/images/e2e/gui-work.png)
- [docs/zh/test/images/e2e/result.png](docs/zh/test/images/e2e/result.png)
- [docs/zh/test/images/e2e/table/action-by-title-2.png](docs/zh/test/images/e2e/table/action-by-title-2.png)
- [docs/zh/test/images/e2e/table/action-by-title.png](docs/zh/test/images/e2e/table/action-by-title.png)
- [docs/zh/test/images/e2e/table/action-in-more.png](docs/zh/test/images/e2e/table/action-in-more.png)
- [docs/zh/test/images/e2e/table/action-in-sub.png](docs/zh/test/images/e2e/table/action-in-sub.png)
- [docs/zh/test/images/e2e/table/check-first-row.png](docs/zh/test/images/e2e/table/check-first-row.png)
- [docs/zh/test/images/e2e/table/check-value.png](docs/zh/test/images/e2e/table/check-value.png)
- [docs/zh/test/images/e2e/table/click-first.png](docs/zh/test/images/e2e/table/click-first.png)
- [docs/zh/test/images/e2e/table/confirm-action.png](docs/zh/test/images/e2e/table/confirm-action.png)
- [docs/zh/test/images/e2e/table/confirm-in-sub.png](docs/zh/test/images/e2e/table/confirm-in-sub.png)
- [docs/zh/test/images/e2e/table/confirm-more-1.png](docs/zh/test/images/e2e/table/confirm-more-1.png)
- [docs/zh/test/images/e2e/table/confirm-more-2.png](docs/zh/test/images/e2e/table/confirm-more-2.png)
- [docs/zh/test/images/e2e/table/detail-1.png](docs/zh/test/images/e2e/table/detail-1.png)
- [docs/zh/test/images/e2e/table/detail-2.png](docs/zh/test/images/e2e/table/detail-2.png)
- [docs/zh/test/images/e2e/table/disable-first.png](docs/zh/test/images/e2e/table/disable-first.png)
- [docs/zh/test/images/e2e/table/disable-more-action.png](docs/zh/test/images/e2e/table/disable-more-action.png)
- [docs/zh/test/images/e2e/table/first-confirm-2.png](docs/zh/test/images/e2e/table/first-confirm-2.png)
- [docs/zh/test/images/e2e/table/first-confirm.png](docs/zh/test/images/e2e/table/first-confirm.png)
- [docs/zh/test/images/e2e/table/header-btn-index.png](docs/zh/test/images/e2e/table/header-btn-index.png)
- [docs/zh/test/images/e2e/table/header-btn-title.png](docs/zh/test/images/e2e/table/header-btn-title.png)
- [docs/zh/test/images/e2e/table/header-confirm-title.png](docs/zh/test/images/e2e/table/header-confirm-title.png)
- [docs/zh/test/images/e2e/table/search-select-1.png](docs/zh/test/images/e2e/table/search-select-1.png)
- [docs/zh/test/images/e2e/table/search-select-2.png](docs/zh/test/images/e2e/table/search-select-2.png)
- [docs/zh/test/images/e2e/table/search-select-3.png](docs/zh/test/images/e2e/table/search-select-3.png)
- [docs/zh/test/images/e2e/table/search-text-1.png](docs/zh/test/images/e2e/table/search-text-1.png)
- [docs/zh/test/images/e2e/table/search-text-2.png](docs/zh/test/images/e2e/table/search-text-2.png)
- [docs/zh/test/images/e2e/table/search-text-3.png](docs/zh/test/images/e2e/table/search-text-3.png)
- [docs/zh/test/images/e2e/table/search.png](docs/zh/test/images/e2e/table/search.png)
- [docs/zh/test/images/e2e/table/select-first.png](docs/zh/test/images/e2e/table/select-first.png)
- [docs/zh/test/images/e2e/table/simple-search.png](docs/zh/test/images/e2e/table/simple-search.png)
- [docs/zh/test/images/e2e/table/wait-1.png](docs/zh/test/images/e2e/table/wait-1.png)
- [docs/zh/test/images/e2e/table/wait-2.png](docs/zh/test/images/e2e/table/wait-2.png)
- [docs/zh/test/images/e2e/table/wait-table-loading.png](docs/zh/test/images/e2e/table/wait-table-loading.png)
- [docs/zh/test/images/unit/result.png](docs/zh/test/images/unit/result.png)

</details>

### Chữ Rackspace trong mã nguồn (không nằm trong ảnh)

- Giao diện/title: [Auth](src/layouts/Auth/index.jsx) dòng 195, 203–205; [Login](src/pages/auth/containers/Login/index.jsx) dòng 111–120, 663; [Blank](src/layouts/Blank/index.jsx) dòng 40, 44; [HTML template](src/asset/template/index.html) dòng 9; [HTML bản build](skyline_console/static/index.html) dòng 1; [tooltip DNS](src/pages/network/containers/Network/actions/networkUtil.js) dòng 81.
- URL Rackspace: [menu](src/layouts/menu.jsx) dòng 46; [basic-menu](src/layouts/basic-menu.jsx) dòng 26; [admin-menu](src/layouts/admin-menu.jsx) dòng 47; [đăng nhập](src/pages/auth/containers/Login/index.jsx) dòng 49; [tạo instance](src/pages/basic/containers/Compute/Instance/Create.jsx) dòng 474, 490 và [BaseStep](src/pages/compute/containers/Instance/actions/StepCreate/BaseStep/index.jsx) dòng 589, 603.
- Tên biến / ghi chú: [networkUtil.js](src/pages/network/containers/Network/actions/networkUtil.js) dòng 28–84, 392; [Router](src/pages/basic/containers/Network/Router/index.jsx) dòng 8; [ClusterTemplates](src/pages/container-infra/containers/ClusterTemplates/actions/StepCreate/index.jsx) dòng 39; [root.js](src/stores/root.js) dòng 45.
- Các file JavaScript build cũng chứa chữ này: [auth.bundle](skyline_console/static/auth.bundle.1791533518.js), [basic.bundle](skyline_console/static/basic.bundle.1791533518.js), [basic-compute.bundle](skyline_console/static/basic-compute.bundle.1791533518.js), [common.bundle](skyline_console/static/common.bundle.1791533518.js) và [main.js](skyline_console/static/main.js).

Ảnh [test/e2e/fixtures/container-file.png](test/e2e/fixtures/container-file.png) chỉ có biểu tượng tài liệu, không có chữ.
