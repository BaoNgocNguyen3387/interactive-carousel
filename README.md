# Project information

## Project enviroment

- Node.js >= 16
- npm or yarn

## Install dependencies

- npm install
  or
- yarn install

## Run project locally

- npm start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## High-level overview of the project structure

src/
├─ components/
│ ├─ slider/
│ │ ├─ components/
│ │ │ ├─ index.ts
│ │ │ ├─ SlideContainer.tsx
│ │ │ └─ SlideItem.tsx
│ │ ├─ constants/
│ │ │ ├─ index.ts
│ │ │ └─ mockup.ts
│ │ ├─ styles/
│ │ │ └─ index.scss
│ │ ├─ ultis/
│ │ │ └─ index.ts
│ │ ├─ index.ts
│ │ └─ interface.ts
│ └─ index.ts
├─ styles/
│ ├─ App.css
│ └─ index.css
├─ App.tsx
└─ index.tsx

## Explanation of how drag (mouse) and swipe (touch) interactions are implemented

- Sử dụng các Pointer Event giúp xử lý đồng thời các thao tác drag và swipe trên destop và mobile trở nên mượt hơn, bởi các Pointer Event này hỗ trợ native touch, tránh phải viết riêng cho từng trường hợp mouse và touch
- Sử dụng các Mouse Event hoặc Touch Event khiến cho việc drag hoặc swipe trở nên khó hiểu hơn với người dùng khi các thao tác trở nên phức tạp và hoạt động không theo mong muốn
- Có ba function giúp xử lý logic của drag và swipe

### startDrag function

- Khi user nhấn và giữ vào slide sẽ update các state:
  isDragging: để dừng chế độ autoplay
  startX: lưu lại vị trí X ban đầu
  dragStartX: lưu lại vị trí translateX ban dầu

- Đồng thời tắt hiệu ứng transition và setPoiterCapture để đảm bảo vẫn nhận được event dù con trỏ rời khỏi element

### onDrag function

- Có nhiệm vụ update translateX khi user kéo slide sang trái hoặc phải, giúp UI dịch chuyển tương ứng với khoảng cách kéo thực tế của UI, tạo cảm giác tự nhiên hơn

- Giá trị translateX transform của slide-list được tính toán bằng các trừ đi BASE_OFFSET (là thương của BUFFER - số lượng item cần rotate vào array và CARD_WIDTH - độ rộng của slide). Cách tính này giúp cho việc drag và swipe trở nên mượt hơn, tránh được lỗi kéo sang trái thì hiển thị các item tiếp theo nhưng kéo sang phải thì không hiển thị các item trước đó, dừng thao tác thì mới tính toán và hiển thị lại

### endDrag function

- Khi use dừng thao tác bằng cách thả chuột hoặc nhấc tay, sẽ update state isDragging về false để có thể tiếp tục auto play

- Đồng thời sẽ tính toán lại các thông tin:
  diff: Khoảng cách kéo
  shiftCount: Xác định số slide cần dịch chuyển, nếu không có thay đổi hoặc bé hơn giá trị DRAG_THRESHOLD thì sẽ update vè vị trí cũ và hiệu ứng dịch chuyển. Ngược lại, sẽ rotate lại list slide, reset translateX về 0 để chuẩn bị cho lần kéo tiếp theo

## Description of how edge cases are handled (e.g. infinite loop, preventing clicks while dragging, pause on hover)

### Infinity Loop

- Thay vì clone DOM hoặc jump index, sử dụng kỹ thuật rotate data array với function rotateLeft tạo cảm giác không có điểm đầu và điểm cuối
  rotateLeft([1,2,3,4]) → [2,3,4,1]

- Sau mỗi lần di chuyển sang trái một slide:
  Dịch chuyển UI với translateX
  Khi animation kết thúc, reset về vị trí 0 và rotate lại list slide

### Preventing clicks while dragging

- SlideItem nhận prop isDragging, nếu isDragging thì sẽ disable click, ngăn việc click nhầm khi đang thao tác

### Pause on hover

- Khi user hover hoặc drag slide, sẽ update các state tương ứng, khiến kích hoạt Effect xử lý
  Khi Effect được kích hoạt, đầu tiên sẽ chạy cleanup function để clearInterval với các giá trị của dependency cũ, sau đó mới chạy setup function. Lúc này, sẽ gặp điều kiện và sẽ return luôn, không kích hoạt lại interval, nên không chạy function slideNext, nên slide sẽ không tự động chạy tiếp

- Thao tác dừng autoplay khi hover hoặc drag giúp tránh xung đột trong việc hiển thị giữa logic autoplay và thao tác của user
