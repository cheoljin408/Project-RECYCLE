Introduction
==============
Idea
------
주변 미대생들의 공모전 출품작들이 퀄리티가 높은 반면에, 수상작 이외의 작품들은 저작권을 받지 못한채 버려지는것을 매우 안타깝게 생각한 것에서 Project idea가 시작되었습니다. 

utility
-------

1. 작품 조회하기
테마, 지역, 상태, 가격별 조회가 가능합니다.
> SQL 쿼리문 작성을 통해 다중 선택 조회 가능.
> masonry라이브러리를 사용하여 핀터레스트 양식 사용
> infinite scroll 기능

좋아요 및 조회수 기능
> session 체크를 통한 User ID별 좋아요 수, 조회수 저장
> session 값 null일 때는 loing 유도


2. 작품 등록하기 (login했을 때)
미대생들의 작품의 이미지, 카테고리, 태그 별 저장이 가능합니다.
> npm multer 사용
> aws cloud DB에 이미지 저장


3. 작품 상세페이지
해당작품의 태그, 상세설명, 작품올린 사람에게 쪽지 보내기 기능이 가능합니다.


4. 마이페이지 (login했을 때)
프로필 수정, 등록한 작품, 구매한 작품, 쪽지함 보기가 가능합니다. 


hot to use
=====================
1. npm install --save
> package.json에 있는 npm을 모두 설치해줍니다.

2. node ./bin/www

3. localhost:3000
