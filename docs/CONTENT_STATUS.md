# EXC content status and source map

**Purpose:** Keep the visual catalogue aligned with the approved Production V1 scope without implying that scope inclusion means a capability is implemented, released or available to a customer.

## Status vocabulary

| EXC label | Meaning | What it does not mean |
| --- | --- | --- |
| In V1 scope | The module is included in the Production V1 charter baseline. | Not a delivery, release or availability claim. |
| Gated | A dependent approval, contract or qualified review is still required before implementation/behavior can be represented as approved. | Not permission to invent rules or show posting behavior. |
| Source-dependent | The reporting capability depends on verified upstream sources and approved accounting/reconciliation contracts. | Not permission to show invented balances, KPIs or financial statements. |

The interface's `scope`, `gated` and `dependent` values are presentation states only. They are not live release flags. M07 and M08 are both included in the Production V1 charter: the former has gated implementation/posting behavior, while the latter depends on approved source data and accounting foundations.

## Module catalogue

| ID | Module | EXC status | Source-grounded boundary |
| --- | --- | --- | --- |
| M01 | Business & Company | In V1 scope | Business identity, workspace, membership, roles, invitations/revocation, company settings and fiscal configuration. |
| M02 | Customers & Suppliers | In V1 scope | Customer/supplier profiles, contacts, addresses, opening-balance and statement concepts, and search. Detailed balance behavior follows its approved contract. |
| M03 | Sales & Invoicing | In V1 scope | Quotations/orders only where supported; invoice lifecycle, payments and allocations remain distinct. Tax, discount, issue/void/correction, return and refund semantics must follow approved contracts. |
| M04 | Purchasing | In V1 scope | Purchase orders, approval and receiving are distinct. Supplier bills/payables and payment behavior are not inferred by the visual map. |
| M05 | Inventory | In V1 scope | Products, categories, units, warehouses and recorded stock movements. Balances derive from movement history; valuation/COGS requires its approved contract. |
| M06 | Expenses & Cash | In V1 scope | Expense records, cashboxes and cash transactions. An incurred expense is not automatically a cash settlement. |
| M07 | Accounting Core | In V1 scope — implementation gated | Chart of Accounts, Journal Entries/Lines and ledger concepts are in the charter; implementation/posting behavior remains gated by the T44 accounting work package and approved financial contracts. |
| M08 | Financial Reports & Dashboard | In V1 scope — source-dependent | Reporting must preserve source, currency, period and limitations. Ledger-dependent statements wait for approved accounting foundations and reconciled source data. |

## Cross-cutting capabilities and financial invariants

- AI is a cross-cutting assistive layer, not a ninth V1 module. EXC explains authorization, grounded responses, human review and traceability; it does not call an AI service.
- An invoice is a billed sales document; a payment is a separate recorded collection; an allocation relates a payment to a receivable context. EXC does not calculate, settle or post.
- Expense records and cash movements remain distinct.
- Purchase-order approval is not receiving; receiving records what arrived, while inventory changes are represented through stock movements.
- No live business data, synthetic operational records, sample balances, fabricated KPIs or simulated tenant are part of this catalogue.

## Source authority

1. [AI Business Assistant — Production V1 ERP Charter](https://app.notion.com/p/4099320b90fb81259288c92962839b90) — canonical module scope, dependencies and financial invariants.
2. [EXC — AIBA Experience Center (Canonical Reference)](https://app.notion.com/p/4179320b90fb81519f4ecad763429f49) — approved explanatory scope, visual boundaries and status treatment.

**Verification note:** This document is a curated source map. It is not a live module implementation report. Re-check the canonical Notion sources before changing a status or capability claim.
