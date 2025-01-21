import React from 'react';
import { Stack, Text, Link } from '@fluentui/react';
import styled from 'styled-components';
import blender from './assets/blender.webp';
import earbuds from './assets/earbuds.webp';
import watch from './assets/watch.webp';

import './AmazonDemoPage.css';

const OuterContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  font-family: 'Arial', sans-serif;
`;

const TopNav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 20px;
`;

const SecondaryNav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 6px 20px;
`;

const HeroSection = styled.div`
  background-color: #f2f2f2;
  color: #333;
  display: flex;
  flex-direction: row;
  padding: 30px 20px;
  align-items: center;
  justify-content: space-between;
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 50%;
`;

const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 40%;
`;

const FeaturedCategories = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;
`;

const RecentlyViewed = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
`;

const ItemsRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 10px;
  overflow-x: auto;
`;

const ItemCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Recommended = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
`;

const TrendingDeals = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
`;

const Footer = styled.div`
  background-color: #f2f2f2;
  padding: 20px;
  margin-top: 30px;
  text-align: center;
  color: #666;
  font-size: 12px;
`;

export const AmazonPage: React.FC = () => {
  return (
    <OuterContainer>
      {/* TOP NAV */}
      <TopNav>
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
        >
          <Stack horizontal verticalAlign="center">
            <Text
              styles={{
                root: { fontWeight: 700, fontSize: 18, color: '#0073bb' },
              }}
            >
              Amazon
            </Text>
            <Stack horizontal verticalAlign="center" className="nav-links">
              <Link href="#" className="nav-link">
                Today's Deals
              </Link>
              <Link href="#" className="nav-link">
                Customer Service
              </Link>
              <Link href="#" className="nav-link">
                Gift Cards
              </Link>
              <Link href="#" className="nav-link">
                Registry
              </Link>
              <Link href="#" className="nav-link">
                Sell
              </Link>
            </Stack>
          </Stack>

          <Stack horizontal verticalAlign="center" className="nav-right">
            <Text className="hello-text">Hello, Sign in</Text>
            <Link href="#" className="nav-link">
              Returns &amp; Orders
            </Link>
            <Text
              styles={{
                root: { fontSize: 14, color: '#0073bb', marginLeft: 20 },
              }}
            >
              Cart
            </Text>
          </Stack>
        </Stack>
      </TopNav>

      {/* SECONDARY NAV */}
      <SecondaryNav>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 15 }}>
          <Link href="#" className="secondary-link">
            Explore
          </Link>
          <Link href="#" className="secondary-link">
            Saved
          </Link>
          <Link href="#" className="secondary-link">
            Fashion
          </Link>
          <Link href="#" className="secondary-link">
            Electronics
          </Link>
          <Link href="#" className="secondary-link">
            Home &amp; Garden
          </Link>
        </Stack>
      </SecondaryNav>

      {/* HERO */}
      <HeroSection>
        <HeroLeft>
          <Text variant="xxLarge" styles={{ root: { color: '#e47911' } }}>
            Winter Sale
          </Text>
          <Text variant="medium">
            Enjoy significant discounts on your favorite brands during this
            winter season.
          </Text>
          <Text variant="small">
            Warm up your home with cozy décor, upgrade your tech devices, or
            find that perfect gift for loved ones. Our winter sale has
            everything you need at incredible prices.
          </Text>
          <button className="hero-button">Shop Now</button>
        </HeroLeft>

        <HeroRight>
          <Stack tokens={{ childrenGap: 6 }}>
            <Text variant="medium" style={{ fontWeight: 600 }}>
              Special Offers
            </Text>
            <Text variant="small">
              Save 20% on household essentials, 15% on select electronics, plus
              free shipping on orders above €50.
            </Text>
          </Stack>
          <Stack tokens={{ childrenGap: 6 }}>
            <Text variant="medium" style={{ fontWeight: 600 }}>
              Highlights
            </Text>
            <Text variant="small">
              Stay in shape with our fitness deals or find new recipes in our
              expanded cookbook collection.
            </Text>
          </Stack>
        </HeroRight>
      </HeroSection>

      {/* FEATURED CATEGORIES */}
      <FeaturedCategories>
        <Text variant="xLarge">Featured Categories</Text>
        <CategoryGrid>
          <div className="category-box">
            <Text styles={{ root: { fontWeight: 600 } }}>Electronics</Text>
            <Text variant="small">
              Discover the latest smartphones, laptops, and accessories to keep
              you connected.
            </Text>
          </div>
          <div className="category-box">
            <Text styles={{ root: { fontWeight: 600 } }}>Books</Text>
            <Text variant="small">
              Escape into new worlds, learn new skills, or find your next
              favorite author.
            </Text>
          </div>
          <div className="category-box">
            <Text styles={{ root: { fontWeight: 600 } }}>
              Home &amp; Kitchen
            </Text>
            <Text variant="small">
              From modern decor to handy appliances, create a welcoming living
              space.
            </Text>
          </div>
        </CategoryGrid>
      </FeaturedCategories>

      {/* RECENTLY VIEWED */}
      <RecentlyViewed>
        <Text variant="xLarge">Recently Viewed Items</Text>
        <ItemsRow>
          <ItemCard>
            <img
              src={earbuds}
              alt="Wireless Earbuds"
              style={{
                width: '320px',
                display: 'block',
                margin: '0 auto 8px',
              }}
            />
            <Text className="item-title">Wireless Earbuds</Text>
            <Text className="item-price">€19.99</Text>
            <Text variant="small">
              Experience crystal-clear sound and a snug fit for your workouts or
              daily commute.
            </Text>
          </ItemCard>
          <ItemCard>
            <img
              src={blender}
              alt="Kitchen Blender"
              style={{
                width: '320px',
                display: 'block',
                margin: '0 auto 8px',
              }}
            />
            <Text className="item-title">Kitchen Blender</Text>
            <Text className="item-price">€25.00</Text>
            <Text variant="small">
              Whip up smoothies, sauces, and soups in seconds with ease and
              convenience.
            </Text>
          </ItemCard>
          <ItemCard>
            <img
              src={watch}
              alt="Smart Watch"
              style={{
                width: '320px',
                display: 'block',
                margin: '0 auto 8px',
              }}
            />
            <Text className="item-title">Smart Watch</Text>
            <Text className="item-price">€29.99</Text>
            <Text variant="small">
              Track your health metrics and notifications with style and
              accuracy.
            </Text>
          </ItemCard>
        </ItemsRow>
        <Link href="#" className="see-all-link">
          See all
        </Link>
      </RecentlyViewed>

      {/* RECOMMENDED */}
      <Recommended>
        <Text variant="xLarge">Recommended for You</Text>
        <div className="recommended-items">
          <div className="rec-item">
            <Text>
              Upgrade your home office with ergonomic chairs &amp; desks
            </Text>
          </div>
          <div className="rec-item">
            <Text>New arrivals in fashion for men &amp; women</Text>
          </div>
          <div className="rec-item">
            <Text>Special discounts on winter sports gear</Text>
          </div>
          <div className="rec-item">
            <Text>Explore fresh kitchen appliances &amp; cookware sets</Text>
          </div>
        </div>
      </Recommended>

      {/* TRENDING DEALS */}
      <TrendingDeals>
        <Text variant="xLarge">Trending Deals</Text>
        <div className="trending-container">
          <div className="trend-card">
            <Text styles={{ root: { fontWeight: 600, display: 'block' } }}>
              Gaming Headset
            </Text>
            <Text
              variant="small"
              styles={{ root: { display: 'block', marginTop: 4 } }}
            >
              Surround sound, noise-cancelling mic. Save 30%.
            </Text>
          </div>
          <div className="trend-card">
            <Text styles={{ root: { fontWeight: 600, display: 'block' } }}>
              Air Purifier
            </Text>
            <Text
              variant="small"
              styles={{ root: { display: 'block', marginTop: 4 } }}
            >
              Breathe easy with cleaner air. Save 25%.
            </Text>
          </div>
          <div className="trend-card">
            <Text styles={{ root: { fontWeight: 600, display: 'block' } }}>
              Leather Backpack
            </Text>
            <Text
              variant="small"
              styles={{ root: { display: 'block', marginTop: 4 } }}
            >
              Stylish &amp; durable. Save 20%.
            </Text>
          </div>
        </div>
      </TrendingDeals>

      {/* FOOTER */}
      <Footer>© 2023 Amazon</Footer>
    </OuterContainer>
  );
};
