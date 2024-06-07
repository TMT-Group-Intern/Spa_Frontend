import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TDSMenuModule } from 'tds-ui/menu';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { IsActiveMatchOptions, RouterModule } from "@angular/router";
import { TDSTagStatusType } from 'tds-ui/tag';
import { NgClassType } from 'tds-ui/core/config';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'frontend-menu',
  standalone: true,
  imports: [CommonModule, TDSMenuModule,RouterModule,ReactiveFormsModule,],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // host: {
  //   class: 'w-fit h-screen'
  // }
})
export class MenuComponent   {

  isCollapsed = false;
    activeTab = 1;
    active = 1;
    active1 = 'top';
    lstMenu:Array<TDSMenuDTO>=[    {
        "name": "Tổng quan",
        // "icon": "tdsi-home-fill",
        "link": "/dashboard",
        htmlIcon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.78742 0.400124H7.78772C8.15564 0.400124 8.5085 0.546282 8.76866 0.806445C9.02883 1.06661 9.17499 1.41947 9.17499 1.78739V5.38757C9.17499 5.75529 9.02899 6.10797 8.76909 6.3681C8.50918 6.62823 8.15664 6.77452 7.78892 6.77484H1.78862C1.60644 6.775 1.42601 6.73927 1.25764 6.6697C1.08927 6.60013 0.936249 6.49808 0.807317 6.36937C0.678386 6.24066 0.576068 6.08782 0.506206 5.91957C0.436343 5.75132 0.400305 5.57095 0.400147 5.38877V1.78859C0.399989 1.60631 0.435756 1.42579 0.505402 1.25734C0.575048 1.08889 0.677209 0.935817 0.806044 0.80687C0.93488 0.677923 1.08786 0.57563 1.25625 0.505838C1.42464 0.436046 1.60514 0.400124 1.78742 0.400124V0.400124Z" class='tds-icon-secondary' />
        <path d="M12.2125 13.2252H18.2128C18.5807 13.2252 18.9335 13.3713 19.1937 13.6315C19.4539 13.8917 19.6 14.2445 19.6 14.6124V18.2126C19.6 18.5803 19.454 18.933 19.1941 19.1931C18.9342 19.4533 18.5817 19.5996 18.214 19.5999H12.2137C12.0315 19.6 11.8511 19.5643 11.6827 19.4947C11.5143 19.4252 11.3613 19.3231 11.2324 19.1944C11.1034 19.0657 11.0011 18.9129 10.9313 18.7446C10.8614 18.5764 10.8254 18.396 10.8252 18.2138V14.6136C10.825 14.4314 10.8608 14.2508 10.9305 14.0824C11.0001 13.9139 11.1023 13.7609 11.2311 13.6319C11.3599 13.503 11.5129 13.4007 11.6813 13.3309C11.8497 13.2611 12.0302 13.2252 12.2125 13.2252V13.2252Z" class='tds-icon-secondary'/>
        <path d="M1.78742 8.42493H7.78772C8.15564 8.42493 8.5085 8.57109 8.76866 8.83125C9.02883 9.09141 9.17499 9.44427 9.17499 9.8122V18.2126C9.17499 18.5803 9.02899 18.933 8.76909 19.1931C8.50918 19.4533 8.15664 19.5996 7.78892 19.5999H1.78862C1.60644 19.6 1.42601 19.5643 1.25764 19.4947C1.08927 19.4252 0.936249 19.3231 0.807317 19.1944C0.678386 19.0657 0.576068 18.9129 0.506206 18.7446C0.436343 18.5764 0.400305 18.396 0.400147 18.2138V9.8134C0.399989 9.63112 0.435756 9.45059 0.505402 9.28214C0.575048 9.11369 0.677209 8.96062 0.806044 8.83167C0.93488 8.70273 1.08786 8.60043 1.25625 8.53064C1.42464 8.46085 1.60514 8.42493 1.78742 8.42493V8.42493Z"  class="tds-icon-primary"/>
        <path d="M12.2125 0.400124H18.2128C18.5807 0.400124 18.9335 0.546282 19.1937 0.806445C19.4539 1.06661 19.6 1.41947 19.6 1.78739V10.1878C19.6 10.5555 19.454 10.9082 19.1941 11.1683C18.9342 11.4285 18.5817 11.5748 18.214 11.5751H12.2137C12.0315 11.5752 11.8511 11.5395 11.6827 11.4699C11.5143 11.4004 11.3613 11.2983 11.2324 11.1696C11.1034 11.0409 11.0011 10.8881 10.9313 10.7198C10.8614 10.5516 10.8254 10.3712 10.8252 10.189V1.78859C10.825 1.60631 10.8608 1.42579 10.9305 1.25734C11.0001 1.08889 11.1023 0.935817 11.2311 0.80687C11.3599 0.677923 11.5129 0.57563 11.6813 0.505838C11.8497 0.436046 12.0302 0.400124 12.2125 0.400124V0.400124Z" class="tds-icon-primary"/>
        </svg>`
    },
    {
        "name": "Live chat",
        "htmlIcon": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.40015 12.6648C2.40015 8.56661 6.10953 5.24484 10.6806 5.24484C15.2468 5.24484 18.9562 8.56661 18.9562 12.6648C18.9562 16.763 15.2468 20.0848 10.6758 20.0848C9.46852 20.0873 8.27298 19.8482 7.15958 19.3815C5.67246 20.1663 4.06327 20.6938 2.40015 20.9416C3.27822 19.7173 3.75647 18.2516 3.76941 16.745C2.88648 15.5674 2.40635 14.1367 2.40015 12.6648ZM7.14494 13.5843C7.67184 13.5843 8.09899 13.1572 8.09899 12.6303C8.09899 12.1034 7.67184 11.6762 7.14494 11.6762C6.61803 11.6762 6.19089 12.1034 6.19089 12.6303C6.19089 13.1572 6.61803 13.5843 7.14494 13.5843ZM10.9613 13.5843C11.4883 13.5843 11.9154 13.1572 11.9154 12.6303C11.9154 12.1034 11.4883 11.6762 10.9613 11.6762C10.4344 11.6762 10.0073 12.1034 10.0073 12.6303C10.0073 13.1572 10.4344 13.5843 10.9613 13.5843ZM14.7778 13.5843C15.3047 13.5843 15.7318 13.1572 15.7318 12.6303C15.7318 12.1034 15.3047 11.6762 14.7778 11.6762C14.2508 11.6762 13.8237 12.1034 13.8237 12.6303C13.8237 13.1572 14.2508 13.5843 14.7778 13.5843Z" class="tds-icon-primary"/>
        <path d="M21.6015 9.82211C21.6015 5.72391 17.8957 2.40214 13.3211 2.40214C11.8083 2.36891 10.3148 2.74529 8.99844 3.49145C7.68212 4.2376 6.59201 5.32576 5.84351 6.64075C7.2857 5.7202 8.96282 5.23519 10.6737 5.24388C15.2448 5.24388 18.9542 8.56565 18.9542 12.6639C18.9481 14.1943 18.4312 15.6789 17.4853 16.8821C18.7975 17.4687 20.1822 17.8775 21.6027 18.0977C20.7264 16.8753 20.2486 15.4123 20.2346 13.9083C21.1179 12.7287 21.5973 11.2957 21.6015 9.82211Z" class="tds-icon-secondary"/>
        </svg>
        `,
        "link": "/livechat",

    },
    {
        "name": "Đơn hàng",
        'htmlIcon': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path fill-rule="evenodd" clip-rule="evenodd" d="M5.1434 2.41296H19.5444L20.2277 5.22145L17.4847 8.03263V21.0356C17.4656 21.2038 17.3827 21.3574 17.2541 21.4627C17.1256 21.568 16.9618 21.6163 16.7987 21.5973H3.08647C2.92337 21.6163 2.75965 21.568 2.63107 21.4627C2.50249 21.3574 2.41951 21.2038 2.40039 21.0356V4.66113C2.48512 3.99217 2.81875 3.38343 3.3307 2.96384C3.84265 2.54425 4.49278 2.34669 5.1434 2.41296ZM12.989 9.33691H6.51612C6.30153 9.33691 6.09573 9.42486 5.944 9.58144C5.79226 9.73802 5.70703 9.95039 5.70703 10.1718C5.70703 10.3933 5.79226 10.6056 5.944 10.7622C6.09573 10.9188 6.30153 11.0068 6.51612 11.0068H12.989C13.2036 11.0068 13.4095 10.9188 13.5612 10.7622C13.713 10.6056 13.7982 10.3933 13.7982 10.1718C13.7982 9.95039 13.713 9.73802 13.5612 9.58144C13.4095 9.42486 13.2036 9.33691 12.989 9.33691ZM12.989 12.4102H6.51612C6.30153 12.4102 6.09573 12.4981 5.944 12.6547C5.79226 12.8113 5.70703 13.0236 5.70703 13.2451C5.70703 13.4665 5.79226 13.6789 5.944 13.8355C6.09573 13.992 6.30153 14.0801 6.51612 14.0801H12.989C13.2036 14.0801 13.4095 13.992 13.5612 13.8355C13.713 13.6789 13.7982 13.4665 13.7982 13.2451C13.7982 13.0236 13.713 12.8113 13.5612 12.6547C13.4095 12.4981 13.2036 12.4102 12.989 12.4102ZM12.989 15.4131H6.51612C6.30153 15.4131 6.09573 15.501 5.944 15.6576C5.79226 15.8142 5.70703 16.0266 5.70703 16.248C5.70703 16.4694 5.79226 16.6818 5.944 16.8384C6.09573 16.995 6.30153 17.083 6.51612 17.083H12.989C13.2036 17.083 13.4095 16.995 13.5612 16.8384C13.713 16.6818 13.7982 16.4694 13.7982 16.248C13.7982 16.0266 13.713 15.8142 13.5612 15.6576C13.4095 15.501 13.2036 15.4131 12.989 15.4131Z" class="tds-icon-primary"/>
       <path d="M20.668 2.7655C20.3364 2.53298 19.9442 2.40973 19.5433 2.41214C19.273 2.41178 19.0054 2.46649 18.7557 2.57303C18.506 2.67957 18.2791 2.83585 18.088 3.03302C17.8969 3.23019 17.7455 3.46436 17.6422 3.72205C17.539 3.97973 17.486 4.25588 17.4863 4.53472V9.48642H20.9141C21.0961 9.48642 21.2706 9.41181 21.3992 9.27904C21.5279 9.14627 21.6002 8.96622 21.6002 8.77845V4.53472C21.6026 4.18252 21.5183 3.83548 21.3552 3.52604C21.1922 3.2166 20.9558 2.95491 20.668 2.7655Z" class="tds-icon-secondary"/>
       </svg>
       `,
        "link": '/orders'
    },
    {
        "name": "Sản phẩm",
        htmlIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.65901V8.54701L3.436 7.81101L11.467 3.01801L12.934 3.02501L21.06 8.05201L21.36 8.55801V10.048L3 9.65901Z" class="tds-icon-secondary"/>
        <path d="M11.4671 3.01758L7.00911 3.03558C6.72477 3.03724 6.44601 3.11464 6.20152 3.25982C5.95704 3.40501 5.75566 3.61272 5.61811 3.86158L3.28711 8.08058L11.0211 8.06258L11.4671 3.01758Z" class="tds-icon-primary"/>
        <path d="M21.059 8.051L18.7 3.826C18.5608 3.57664 18.3578 3.36875 18.1118 3.22362C17.8658 3.07848 17.5857 3.00131 17.3 3L12.842 3.024L13.306 8.069L21.059 8.051Z" class="tds-icon-primary"/>
        <path d="M21.355 9.457H21.347V9.412L12.862 9.44H11.493L3.008 9.412V9.457H3V11.613H3.008L3.04 19.945C3.03998 20.3273 3.19097 20.6942 3.46009 20.9657C3.72921 21.2373 4.09469 21.3916 4.477 21.395H4.489L11.62 21.374L19.865 21.392H19.879C20.2612 21.3883 20.6266 21.234 20.8956 20.9625C21.1647 20.691 21.3158 20.3242 21.316 19.942L21.348 11.61H21.356V10.524L21.355 9.457Z" class="tds-icon-primary"/>
        </svg>
        `,
        "listChild": [
            {
                "name": "Quản lí sản phẩm",
                "link": "/products/product-manager"
            },
            {
                "name": "Quản lí thuộc tính",
                "link": "/products/attribute-manager"
            },
        ]
    },
    {
        name: 'Khách hàng',
        htmlIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9989 10.0544C13.8905 10.0544 15.424 8.52091 15.424 6.62926C15.424 4.73761 13.8905 3.20413 11.9989 3.20413C10.1072 3.20413 8.57373 4.73761 8.57373 6.62926C8.57373 8.52091 10.1072 10.0544 11.9989 10.0544Z" class="tds-icon-primary"/>
        <path d="M18.4834 10.4149C19.6793 10.4149 20.6487 9.44544 20.6487 8.24957C20.6487 7.0537 19.6793 6.08426 18.4834 6.08426C17.2876 6.08426 16.3181 7.0537 16.3181 8.24957C16.3181 9.44544 17.2876 10.4149 18.4834 10.4149Z" class="tds-icon-secondary"/>
        <path d="M5.52566 10.4149C6.72153 10.4149 7.69097 9.44544 7.69097 8.24957C7.69097 7.0537 6.72153 6.08426 5.52566 6.08426C4.32979 6.08426 3.36035 7.0537 3.36035 8.24957C3.36035 9.44544 4.32979 10.4149 5.52566 10.4149Z" class="tds-icon-secondary"/>
        <path d="M7.68311 12.2145C6.83077 11.5162 6.05885 11.6086 5.07332 11.6086C3.59934 11.6086 2.40015 12.8007 2.40015 14.2656V18.5652C2.40015 19.2014 2.91943 19.7187 3.558 19.7187C6.31487 19.7187 5.98275 19.7686 5.98275 19.5998C5.98275 16.5531 5.62189 14.3189 7.68311 12.2145Z" class="tds-icon-secondary"/>
        <path d="M12.936 11.4081C11.2146 11.2645 9.71834 11.4097 8.42777 12.475C6.26809 14.2049 6.68371 16.5341 6.68371 19.3835C6.68371 20.1374 7.29709 20.7622 8.06243 20.7622C16.3726 20.7622 16.7033 21.0303 17.1961 19.939C17.3577 19.5699 17.3134 19.6872 17.3134 16.1568C17.3134 13.3527 14.8854 11.4081 12.936 11.4081Z" class="tds-icon-primary"/>
        <path d="M18.9279 11.6085C17.937 11.6085 17.1693 11.517 16.3181 12.2144C18.3639 14.3032 18.0185 16.385 18.0185 19.5997C18.0185 19.7695 17.7428 19.7186 20.4019 19.7186C21.0633 19.7186 21.6011 19.1828 21.6011 18.5241V14.2655C21.6011 12.8006 20.4019 11.6085 18.9279 11.6085Z" class="tds-icon-secondary"/>
        </svg>
        `,
        link: './customer'
    },
    {
        "name": "Kịch bản",
        htmlIcon: `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.80052 0.400116H11.9971L17.4009 5.78349V18.4001C17.4009 18.7185 17.2745 19.0238 17.0493 19.2489C16.8242 19.4741 16.5189 19.6005 16.2005 19.6005H1.80052C1.48215 19.6005 1.17682 19.4741 0.951694 19.2489C0.72657 19.0238 0.600098 18.7185 0.600098 18.4001V1.60054C0.600098 1.28217 0.72657 0.976836 0.951694 0.751712C1.17682 0.526589 1.48215 0.400116 1.80052 0.400116V0.400116Z" class="tds-icon-primary"/>
        <path d="M17.3841 5.79984H13.2063C12.8879 5.79984 12.5826 5.67336 12.3575 5.44824C12.1323 5.22312 12.0059 4.91778 12.0059 4.59941V0.411346L17.3841 5.79984Z" class="tds-icon-secondary"/>
        <path d="M4.521 13.7468V15.4024H6.17653L11.0601 10.5189L9.40452 8.86331L4.521 13.7468Z" class="tds-icon-secondary"/>
        <path d="M12.3348 8.61736L11.3044 7.58568C11.2215 7.50285 11.1091 7.45633 10.9919 7.45633C10.8746 7.45633 10.7622 7.50285 10.6793 7.58568L9.87134 8.39364L11.5269 10.0492L12.3348 9.24122C12.4173 9.15834 12.4635 9.04619 12.4635 8.92929C12.4635 8.81239 12.4173 8.70024 12.3348 8.61736V8.61736Z" class="tds-icon-secondary"/>
        </svg>
        `,
        // "listChild": [
        //     {
        //         "name": "Thông tin công ty",
        //         "link": "setting-resource/about-company"
        //     },

        // ]
    },
    {
        "name": "Chatbot",
        htmlIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.1798 6.51946C9.75573 6.51946 9.3552 6.52906 8.94876 6.51115C8.87572 6.51115 8.77435 6.40239 8.74254 6.32117C8.61821 6.00361 8.50969 5.67991 8.41739 5.35132C8.4023 5.27749 8.36755 5.20923 8.31687 5.15405C8.26618 5.09888 8.20155 5.05894 8.12999 5.03843C7.87021 4.94116 7.6473 4.7634 7.49291 4.53033C7.33852 4.29725 7.26046 4.02069 7.26994 3.7401C7.27494 3.465 7.36187 3.19795 7.51923 2.97378C7.67659 2.74961 7.89704 2.5788 8.15177 2.4839C8.4065 2.38899 8.68359 2.37439 8.94668 2.44191C9.20977 2.50942 9.44658 2.6559 9.6261 2.86224C9.81986 3.08326 9.93698 3.36247 9.95952 3.65728C9.98207 3.95209 9.90883 4.24638 9.751 4.49504C9.70435 4.5601 9.67593 4.63671 9.66867 4.7168C9.66141 4.7969 9.67563 4.87749 9.7098 4.95008C9.8818 5.42783 10.029 5.91271 10.181 6.39524C10.186 6.43651 10.1857 6.47829 10.1798 6.51946Z" class="tds-icon-secondary"/>
        <path d="M13.7612 6.51911C13.9462 5.95417 14.1217 5.44412 14.2772 4.92218C14.3108 4.80298 14.2999 4.6755 14.2466 4.56395C14.0894 4.32508 14.0101 4.04231 14.0197 3.75535C14.0293 3.46839 14.1273 3.19165 14.3 2.9641C14.4727 2.73655 14.7115 2.56964 14.9826 2.48676C15.2538 2.40387 15.5437 2.40909 15.8117 2.50192C16.0797 2.59475 16.3123 2.77043 16.4767 3.00419C16.6411 3.23796 16.7292 3.51809 16.7285 3.80521C16.7278 4.09234 16.6384 4.372 16.4727 4.60492C16.3071 4.83783 16.0737 5.01225 15.8053 5.1037C15.7021 5.15555 15.6211 5.24394 15.5778 5.35214C15.46 5.66029 15.3611 5.97807 15.2668 6.29458C15.2618 6.33017 15.2498 6.36444 15.2317 6.39533C15.2135 6.42621 15.1895 6.45306 15.1611 6.47449C15.1326 6.49593 15.1002 6.51145 15.0658 6.52013C15.0314 6.52881 14.9956 6.5305 14.9605 6.52509C14.5788 6.51075 14.1971 6.51911 13.7612 6.51911Z" class="tds-icon-secondary"/>
        <path d="M2.5201 17.0976C2.11751 16.8529 1.78432 16.5066 1.55298 16.0925C1.32165 15.6784 1.20007 15.2106 1.20007 14.7347C1.20007 14.2588 1.32165 13.7908 1.55298 13.3767C1.78432 12.9626 2.11751 12.6164 2.5201 12.3716V17.0976Z" class="tds-icon-secondary"/>
        <path d="M21.4918 12.3833C21.8913 12.6278 22.2218 12.9729 22.4512 13.3849C22.6805 13.797 22.8011 14.2619 22.8011 14.735C22.8011 15.2081 22.6805 15.6733 22.4512 16.0853C22.2218 16.4973 21.8913 16.8422 21.4918 17.0868V12.3833Z" class="tds-icon-secondary"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2242 21.5809C10.8031 21.5836 11.3819 21.5863 11.9607 21.5863L11.9571 21.591H17.9501C18.234 21.6102 18.5187 21.5679 18.7852 21.4668C19.0517 21.3657 19.2939 21.2083 19.4956 21.0049C19.6974 20.8015 19.854 20.5568 19.9552 20.2871C20.0564 20.0175 20.0998 19.7291 20.0824 19.4412C20.0879 16.3103 20.0879 13.1794 20.0824 10.0486C20.1016 9.75836 20.059 9.46731 19.9577 9.19521C19.8563 8.92312 19.6985 8.67634 19.4948 8.47147C19.2912 8.26659 19.0465 8.1085 18.7773 8.00783C18.5082 7.90715 18.2208 7.86629 17.9347 7.88798H6.0361C5.74522 7.86773 5.45343 7.91091 5.18047 8.01483C4.90751 8.11875 4.65972 8.28091 4.45388 8.49028C4.24804 8.69964 4.08894 8.95138 3.98733 9.22845C3.88571 9.50553 3.84395 9.80155 3.86487 10.0964C3.8637 11.1241 3.86475 12.1519 3.8658 13.1798C3.8679 15.234 3.87001 17.2883 3.8543 19.3421C3.83922 19.6427 3.88653 19.9431 3.99326 20.224C4.09998 20.5049 4.26372 20.76 4.47383 20.9727C4.68395 21.1854 4.93577 21.351 5.21301 21.4588C5.49025 21.5665 5.78673 21.6141 6.08324 21.5983C7.46282 21.568 8.84356 21.5745 10.2242 21.5809ZM15.2866 13.2063C15.1713 13.2564 15.0474 13.2825 14.922 13.2834C14.7965 13.2873 14.6715 13.2657 14.5543 13.2199C14.4371 13.174 14.3302 13.1048 14.2398 13.0165C14.1494 12.9281 14.0772 12.8224 14.0277 12.7054C13.9781 12.5884 13.9522 12.4625 13.9513 12.3352C13.9491 12.2083 13.9716 12.0822 14.0175 11.9641C14.0634 11.846 14.1318 11.7383 14.2188 11.647C14.3058 11.5557 14.4096 11.4827 14.5244 11.4321C14.6392 11.3815 14.7627 11.3544 14.8879 11.3522C15.013 11.35 15.1374 11.3729 15.2539 11.4194C15.3703 11.4659 15.4766 11.5352 15.5666 11.6234C15.6567 11.7116 15.7287 11.8168 15.7786 11.9332C15.8284 12.0496 15.8553 12.1749 15.8574 12.3018C15.8609 12.4289 15.8393 12.5554 15.7939 12.6739C15.7486 12.7924 15.6803 12.9004 15.5932 12.9918C15.5061 13.0833 15.4018 13.1562 15.2866 13.2063ZM9.90908 11.9665C9.9556 12.0841 9.97861 12.2099 9.97674 12.3366C9.9789 12.4632 9.95557 12.5889 9.90821 12.7062C9.86085 12.8234 9.79045 12.9296 9.70127 13.0183C9.61209 13.107 9.50599 13.1765 9.38949 13.2223C9.273 13.2681 9.14852 13.2894 9.02364 13.2848C8.77776 13.282 8.54269 13.182 8.36859 13.0059C8.19449 12.8299 8.0952 12.5918 8.09183 12.3425C8.08963 12.0866 8.18756 11.84 8.36421 11.6571C8.54086 11.4742 8.78182 11.3698 9.03429 11.3667C9.15925 11.3667 9.28299 11.3919 9.39827 11.4408C9.51354 11.4897 9.61803 11.5613 9.70573 11.6516C9.79343 11.7418 9.86255 11.8489 9.90908 11.9665ZM11.9591 16.052H14.7959C14.914 16.0524 15.0281 16.0946 15.1187 16.1714C15.2483 16.298 15.2036 16.4569 15.0952 16.5907C14.741 17.0347 14.2989 17.3985 13.7975 17.6587C13.296 17.9188 12.7463 18.0697 12.1839 18.1013C11.6215 18.1329 11.0588 18.0446 10.5321 17.8422C10.0053 17.6398 9.52631 17.3279 9.12582 16.9263C9.05433 16.8566 8.98926 16.7804 8.92395 16.7038L8.92388 16.7037C8.90527 16.6819 8.88664 16.6601 8.86783 16.6384C8.8147 16.5878 8.77626 16.5235 8.75674 16.4523C8.73721 16.3811 8.73735 16.3059 8.7571 16.2348C8.79199 16.1651 8.84803 16.1086 8.91694 16.0735C8.98585 16.0385 9.06402 16.0267 9.13999 16.04H11.6894L11.9591 16.052Z" class="tds-icon-primary"/>
        </svg>`,
        "listChild": [
            {
                "name": "Câu mẫu phản hồi",
                "link": "chatbot/sentence-report"
            },
            {
                "name": "Từ khóa",
                "link": "chatbot/keyword"
            },
            {
                "name": "Ý định - Câu mẫu",
                "link": "chatbot/intent"
            },
            {
                "name": "Xử lý phản hồi",
                "link": "chatbot/report-reply"
            }
        ]
    },
    {
        "name": "Báo cáo",
        htmlIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4002 12.6011V4.72525H10.8381C9.16926 4.72525 7.53786 5.22013 6.15024 6.14731C4.76262 7.07449 3.68111 8.39232 3.04245 9.93417C2.4038 11.476 2.2367 13.1726 2.56228 14.8094C2.88787 16.4462 3.69151 17.9497 4.87158 19.1298C6.05165 20.3099 7.55516 21.1135 9.19197 21.4391C10.8288 21.7647 12.5254 21.5976 14.0672 20.9589C15.6091 20.3203 16.9269 19.2388 17.8541 17.8511C18.7812 16.4635 19.2761 14.8321 19.2761 13.1632V12.6011H11.4002Z" class="tds-icon-primary"/>
        <path d="M13.163 2.40012H12.6008V11.4002H21.6009V10.8381C21.5986 8.60094 20.7088 6.45607 19.1269 4.87415C17.545 3.29224 15.4001 2.40248 13.163 2.40012V2.40012Z" class="tds-icon-secondary"/>
        </svg>
        `,
        link: './report'
    },
    {
        "name": "Cấu hình",
        "htmlIcon": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0007 9.18799C11.4443 9.18799 10.9005 9.35296 10.4379 9.66205C9.97532 9.97114 9.61476 10.4105 9.40186 10.9245C9.18895 11.4385 9.13326 12.004 9.2418 12.5497C9.35034 13.0954 9.61823 13.5966 10.0116 13.99C10.405 14.3834 10.9062 14.6513 11.4519 14.7598C11.9976 14.8684 12.5632 14.8126 13.0772 14.5997C13.5911 14.3868 14.0305 14.0263 14.3396 13.5637C14.6487 13.1011 14.8136 12.5573 14.8136 12.0009C14.813 11.2551 14.5164 10.54 13.989 10.0126C13.4616 9.4852 12.7465 9.18862 12.0007 9.18799Z" class="tds-icon-secondary"/>
        <path d="M21.6011 13.2787V10.7226C21.6011 10.6356 21.571 10.5514 21.5158 10.4842C21.4607 10.4171 21.3839 10.3711 21.2987 10.3541L18.9982 9.90172C18.8564 9.42916 18.6666 8.97236 18.4317 8.53845L19.7134 6.61836C19.7615 6.5463 19.7832 6.45979 19.7746 6.37357C19.7661 6.28735 19.7279 6.20676 19.6666 6.14553L17.8581 4.33464C17.7969 4.27334 17.7163 4.23517 17.6301 4.22664C17.5439 4.2181 17.4574 4.23973 17.3853 4.28784L15.4652 5.56951C15.0313 5.33466 14.5745 5.14486 14.1019 5.00308L13.6471 2.70256C13.6304 2.61721 13.5845 2.54034 13.5172 2.48516C13.45 2.42998 13.3657 2.39992 13.2787 2.40015H10.7226C10.6356 2.40015 10.5514 2.43029 10.4842 2.48543C10.4171 2.54058 10.3711 2.61731 10.3541 2.70256L9.90172 5.00308C9.42916 5.14487 8.97236 5.33467 8.53845 5.56951L6.61836 4.28784C6.5463 4.23973 6.45979 4.2181 6.37357 4.22664C6.28735 4.23517 6.20676 4.27334 6.14553 4.33464L4.33464 6.14313C4.27334 6.20436 4.23517 6.28495 4.22663 6.37117C4.2181 6.45739 4.23973 6.5439 4.28784 6.61596L5.5695 8.53605C5.33466 8.96995 5.14486 9.42676 5.00308 9.89932L2.70256 10.3541C2.61731 10.3711 2.54058 10.4171 2.48543 10.4842C2.43029 10.5514 2.40015 10.6356 2.40015 10.7226V13.2787C2.40015 13.3656 2.43029 13.4498 2.48543 13.517C2.54058 13.5842 2.61731 13.6302 2.70256 13.6471L5.00308 14.0995C5.14487 14.5721 5.33467 15.0289 5.5695 15.4628L4.28784 17.3829C4.23973 17.455 4.2181 17.5415 4.22663 17.6277C4.23517 17.7139 4.27334 17.7945 4.33464 17.8557L6.14313 19.6642C6.20436 19.7255 6.28495 19.7637 6.37117 19.7722C6.45739 19.7808 6.5439 19.7591 6.61596 19.711L8.53605 18.4293C8.96995 18.6642 9.42676 18.854 9.89932 18.9958L10.3517 21.2963C10.3683 21.3824 10.4144 21.46 10.4821 21.5157C10.5498 21.5713 10.6349 21.6016 10.7226 21.6011H13.2787C13.3656 21.6011 13.4498 21.571 13.517 21.5158C13.5842 21.4607 13.6302 21.3839 13.6471 21.2987L14.0995 18.9982C14.5721 18.8564 15.0289 18.6666 15.4628 18.4317L17.3829 19.7134C17.455 19.7615 17.5415 19.7832 17.6277 19.7746C17.7139 19.7661 17.7945 19.7279 17.8557 19.6666L19.6642 17.8581C19.7255 17.7969 19.7637 17.7163 19.7722 17.6301C19.7808 17.5439 19.7591 17.4574 19.711 17.3853L18.4293 15.4652C18.6642 15.0313 18.854 14.5745 18.9958 14.1019L21.2963 13.6495C21.3825 13.6332 21.4602 13.5871 21.5159 13.5194C21.5716 13.4516 21.6018 13.3664 21.6011 13.2787ZM12.1314 15.9356C11.3421 15.9617 10.5631 15.7497 9.89573 15.3273C9.22837 14.9049 8.70348 14.2915 8.38923 13.5669C8.07499 12.8423 7.98593 12.04 8.13362 11.2641C8.28131 10.4882 8.65893 9.77469 9.21741 9.21621C9.77589 8.65773 10.4894 8.28012 11.2653 8.13242C12.0412 7.98473 12.8435 8.07379 13.5681 8.38804C14.2927 8.70228 14.9061 9.22717 15.3285 9.89453C15.7509 10.5619 15.9629 11.3409 15.9368 12.1302C15.9027 13.1286 15.4909 14.0769 14.7845 14.7833C14.0781 15.4897 13.1298 15.9015 12.1314 15.9356Z" class="tds-icon-primary"/>
        </svg>
        `,
        "listChild": [
            {
                "name": "Cấu hình chung",
                "link": "configuration/general"
            },
            {
                "name": "Cấu hình trả lời",
                "link": "configuration/answer"
            },
            {
                "name": "Quản lý người dùng",
                "link": "configuration/user"
            }
        ]
    },
    ]
    setActiveTab(event:TDSSafeAny) {
      this.activeTab = event;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }



    toggleCollapsed(): void {
      this.isCollapsed = !this.isCollapsed;
    }

    onOpenChange(e:boolean){
      this.isCollapsed = e;
    }
}
export interface TDSMenuDTO {
  name: string;
  icon?: string;
  link?: unknown;
  disabled?: boolean;
  listChild?: Array<TDSMenuDTO>;
  isSelected?: boolean;
  isOpen?: boolean;
  uid?:string,
  hidden?:boolean,
  groupTitle?:string;
  linkProps?: TDSMenuLinkPropsDTO;
  htmlIcon?:string;
  badge?:TDSMenuBadgeDTO;
  tag?:TDSMenuTagDTO;
  //dùng cho menu cấp cha
  dot?:TDSMenuDotDTO;
}

export interface TDSMenuLinkPropsDTO {
  queryParams?: {[k: string]: unknown};
  fragment?: string;
  queryParamsHandling?: 'merge' | 'preserve' | '';
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: {[k: string]: unknown};
  routerLinkActiveOptions?:IsActiveMatchOptions;
  routerLinkActive?: string | string[];
}

export interface TDSMenuBadgeDTO{
  count:number;
  tdsStyle?:NgClassType;
  overflowCount:number;
}

export interface TDSMenuTagDTO{
  type?:'default' | 'outline';
  status?:TDSTagStatusType;
  rounded?:string;
  text:string;
}

export interface TDSMenuDotDTO{
  status?:TDSTagStatusType;
}
