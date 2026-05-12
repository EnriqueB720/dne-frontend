import { User as UserRequestData } from '@generated';

export class User {
  public data: UserRequestData;

  constructor(data: UserRequestData) {
    this.data = data;
  }

  get userId() {
    return this.data?.userId!;
  }

  get email() {
    return this.data?.email!;
  }

  get name() {
    return this.data?.name!;
  }

  get phone() {
    return this.data?.phone!;
  }

  get profilePicture() {
    return this.data?.profilePicture ?? undefined;
  }

  get isCustomer() {
    return !!this.data?.isCustomer;
  }

  get isSupplier() {
    return !!this.data?.isSupplier;
  }

  get isAdmin() {
    return !!this.data?.isAdmin;
  }

  /** Returns the customerId from the linked Customer profile, or null. */
  get customerId(): number | null {
    return (this.data as any)?.customer?.customerId ?? null;
  }

  /**
   * Returns the first supplierId from the linked Supplier profiles, or null.
   * (Schema currently allows multiple suppliers per user; in practice it's 0 or 1.)
   */
  get supplierId(): number | null {
    const suppliers = (this.data as any)?.supplier;
    if (Array.isArray(suppliers) && suppliers.length > 0) {
      return suppliers[0].supplierId ?? null;
    }
    if (suppliers && typeof suppliers === 'object') {
      return suppliers.supplierId ?? null;
    }
    return null;
  }
}
