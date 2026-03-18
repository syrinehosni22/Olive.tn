
import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import gsap from "gsap";
import SplitType from "split-type";
import { Link } from "react-router-dom";

const BannerSection = () => {
  
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    if (swiper) {
      swiper.on("slideChange", () => {
        const currentSlide = swiper.slides[swiper.activeIndex];
        const textsToAnimate = currentSlide.querySelectorAll(".rv-text-anime");
        textsToAnimate.forEach((textToAnimate: HTMLElement) => {
          const animate = new SplitType(textToAnimate, {
            types: "words,chars",
          });
          gsap.from(animate.chars, {
            opacity: 0,
            x: 100,
            duration: 1.1,
            stagger: { amount: 0.9 },
          });
        });
      });
    }
  }, [swiper]);

  return (
    <section className="rv-20-banner_section">
      <Swiper
        autoplay={true}
        loop={true}
        effect="fade"
        navigation={{
          nextEl: ".rv-20-banner_slide_button_next",
          prevEl: ".rv-20-banner_slide_button_prev",
        }}
        modules={[EffectFade, Navigation, Autoplay]}
        onSwiper={(swiper) => setSwiper(swiper)}
      >
        <SwiperSlide className="rv-20-banner_slide">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-sm-10 col-md-9 col-lg-8 col-xl-7">
                <div className="rv-20-banner_content">
                  {/* <span className="rv-20-banner_content_sub_heading rv-text-anime d-flex">
                    <span></span> A Dream Garden Home
                  </span> */}
                  <h1 className="rv-20-banner_content_heading rv-text-anime">
                    Olive
                  </h1>
                  <h3 className="rv-text-anime">
                    The Best Of Tunisian Olive Oil
                  </h3>
                  <h4 className="rv-text-anime">Tn</h4>
                  <div className="rv-20-banner_button_area">
                    <Link to="/register" className="rv-20-banner_content_btn">
                      S'inscrire
                    </Link>
                    {/* <a
                      className="rv-20-banner_content_play_btn"
                      role="button"
                      onClick={openVideoModal}
                    >
                      <i className="fas fa-play"></i> Play Now
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="rv-20-banner_slide rv-20-banner_slide-2 ">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-sm-10 col-md-9 col-lg-8 col-xl-7">
                <div className="rv-20-banner_content">
                  {/* <span className="rv-20-banner_content_sub_heading rv-text-anime">
                    <span></span> A Dream Garden Home
                  </span> */}
                  <h1 className="rv-20-banner_content_heading rv-text-anime">
                    Olive
                  </h1>
                  <h3 className="rv-text-anime">
                    The Best Of Tunisian Olive Oil
                  </h3>
                  <h4 className="rv-text-anime">Tn</h4>
                  <div className="rv-20-banner_button_area">
                    <Link to="/register" className="rv-20-banner_content_btn">
                      S'inscrire
                    </Link>
                    <a
                      className="rv-20-banner_content_play_btn"
                      role="button"
                    >
                      <i className="fas fa-play"></i> Play Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default BannerSection;
