import {
  ProductCategory,
  ProductCategoryCodeEnum,
} from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { sumProduct } from './helpers';

export function calculatePriceFromLB(data: {
  productOutput: {
    productItemId: string;
    quantity: number;
    weight: number;
  }[];
  productCategoriesAndBaseWeight: ProductCategory[] & { baseWeight: number }[];
  jagalCOGS: number;
  brankasCOGS: number;
  ayamUtuhCOGS: number;
  innardsInventoryPrice: number;
  feetInventoryPrice: number;
  headInventoryPrice: number;
  innardsBaseWeight: number;
  headBaseWeight: number;
  feetBaseWeight: number;
}): {
  quantity: number;
  weight: number;
  productItemId: string;
  price: number | null;
}[] {
  const {
    productOutput,
    productCategoriesAndBaseWeight,
    jagalCOGS,
    brankasCOGS,
    ayamUtuhCOGS,
    innardsInventoryPrice,
    feetInventoryPrice,
    headInventoryPrice,
    innardsBaseWeight,
    headBaseWeight,
    feetBaseWeight,
  } = data;

  return productOutput.map((output) => {
    // FIXME: need to change this to productItem
    const outputProductCategory = productCategoriesAndBaseWeight.find((product) =>
      product.items.some((item) => item.id === output.productItemId),
    ) as ProductCategory & { baseWeight: number };

    if (!outputProductCategory || outputProductCategory.baseWeight === null) {
      throw new Error('Invalid product manufacture output!');
    }

    let price = 0;

    if (outputProductCategory.code === ProductCategoryCodeEnum.BRANKAS) {
      price = brankasCOGS;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.AYAM_UTUH) {
      price = ayamUtuhCOGS;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.INNARDS) {
      price = innardsInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.FEET) {
      price = feetInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.HEAD) {
      price = headInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.CARCASS) {
      price =
        (jagalCOGS -
          innardsInventoryPrice * innardsBaseWeight -
          headInventoryPrice * headBaseWeight -
          feetInventoryPrice * feetBaseWeight) /
        outputProductCategory.baseWeight;
    } else {
      throw new Error('Invalid product manufacture output from LIVE BIRD!');
    }

    return { ...output, price };
  });
}

export function calculatePriceFromBrankas(data: {
  productOutput: {
    productItemId: string;
    quantity: number;
    weight: number;
  }[];
  productCategories: ProductCategory[];
  brankasCOGS: number;
  brankasBaseWeight: number;
  innardsInventoryPrice: number;
  feetInventoryPrice: number;
  headInventoryPrice: number;
  brankasRatio: number;
  innardsRatio: number;
  feetRatio: number;
  headRatio: number;
}): {
  quantity: number;
  weight: number;
  productItemId: string;
  price: number | null;
}[] {
  const {
    productOutput,
    productCategories,
    brankasCOGS,
    brankasBaseWeight,
    innardsInventoryPrice,
    feetInventoryPrice,
    headInventoryPrice,
    brankasRatio,
    innardsRatio,
    feetRatio,
    headRatio,
  } = data;
  const pricePerKgInnards = (innardsRatio / brankasRatio) * brankasBaseWeight;
  const pricePerKgFeet = (feetRatio / brankasRatio) * brankasBaseWeight;
  const pricePerKgHead = (headRatio / brankasRatio) * brankasBaseWeight;

  return productOutput.map((output) => {
    const outputProductCategory = productCategories.find((product) =>
      product.items.some((item) => item.id === output.productItemId),
    );

    if (!outputProductCategory) {
      throw new Error('Invalid product manufacture output!');
    }

    let price = 0;

    if (outputProductCategory.code === ProductCategoryCodeEnum.AYAM_UTUH) {
      const pricePerKgAyamUtuh = (outputProductCategory.ratio / brankasRatio) * brankasBaseWeight;
      price =
        (brankasCOGS * brankasBaseWeight - innardsInventoryPrice * pricePerKgInnards) /
        pricePerKgAyamUtuh;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.INNARDS) {
      price = innardsInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.FEET) {
      price = feetInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.HEAD) {
      price = headInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.CARCASS) {
      const pricePerKgCarcass = (outputProductCategory.ratio / brankasRatio) * brankasBaseWeight;
      price =
        (brankasCOGS * brankasBaseWeight -
          sumProduct(
            [innardsInventoryPrice, headInventoryPrice, feetInventoryPrice],
            [pricePerKgInnards, pricePerKgHead, pricePerKgFeet],
          )) /
        pricePerKgCarcass;
    } else {
      throw new Error('Invalid product manufacture output from BRANKAS!');
    }

    return { ...output, price };
  });
}

export function calculatePriceFromAyamUtuh(data: {
  productOutput: {
    productItemId: string;
    quantity: number;
    weight: number;
  }[];
  productCategories: ProductCategory[];
  ayamUtuhCOGS: number;
  ayamUtuhBaseWeight: number;
  feetInventoryPrice: number;
  headInventoryPrice: number;
  ayamUtuhRatio: number;
  feetRatio: number;
  headRatio: number;
}): {
  quantity: number;
  weight: number;
  productItemId: string;
  price: number | null;
}[] {
  const {
    productOutput,
    productCategories,
    ayamUtuhCOGS,
    ayamUtuhBaseWeight,
    feetInventoryPrice,
    headInventoryPrice,
    ayamUtuhRatio,
    feetRatio,
    headRatio,
  } = data;

  const pricePerKgFeet = (feetRatio / ayamUtuhRatio) * ayamUtuhBaseWeight;
  const pricePerKgHead = (headRatio / ayamUtuhRatio) * ayamUtuhBaseWeight;

  return productOutput.map((output) => {
    const outputProductCategory = productCategories.find((product) =>
      product.items.some((item) => item.id === output.productItemId),
    );

    if (!outputProductCategory) {
      throw new Error('Invalid product manufacture output!');
    }

    let price = 0;

    if (outputProductCategory.code === ProductCategoryCodeEnum.FEET) {
      price = feetInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.HEAD) {
      price = headInventoryPrice;
    } else if (outputProductCategory.code === ProductCategoryCodeEnum.CARCASS) {
      const pricePerKgCarcass = (outputProductCategory.ratio / ayamUtuhRatio) * ayamUtuhBaseWeight;
      price =
        (ayamUtuhBaseWeight * ayamUtuhCOGS -
          sumProduct([headInventoryPrice, feetInventoryPrice], [pricePerKgHead, pricePerKgFeet])) /
        pricePerKgCarcass;
    } else {
      throw new Error('Invalid product manufacture output from AYAM UTUH!');
    }
    return { ...output, price };
  });
}
