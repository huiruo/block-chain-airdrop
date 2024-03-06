## Solana的合约编程总结
Solana的合约编程，其实主要就是对Account的增删改查，或者说就是我们普通程序中的 对文件的增删改查。这其中需要使用Solana提供的SDK，按照其框架进行编程，一些主要 数据结构在SDK中都有提供，在编写逻辑的时候，可以直接使用。

## 官方文档
https://docs.solana.com/developing/deployed-programs/overview

[开发文档](https://solana.com/docs)

在Solana的开发文档中 有列出一系列的基本概念，但是对于合约开发，我们只要知道其中的一部分就可以了。

Solana的合约程序也被 叫做“on-chain program” 链上程序。

和EOS使用WebAssembly runtime不同的是，EOS的合约是被编译成 WebAssembly字节码，然后EOS节点运行一个WebAxxembly的虚拟机runtime来执行编译成WebAssembly的智能合约

而Solana的合约是被编译 成BPF字节码，而不是WebAssembly。 Solana节点的runtime 会加载 这个BPF字节码并执行其逻辑。

理论上，只要支持编译成BPF字节码的 程序语言，都可以编写Solana合约，只要输出的是编译后的BPF字节码就可以了。但是Solana官方主要提供了稳定的 Rust和C的支持。这两个语言都可以通过LLVM后端生成BPF字节码。鉴于Solana本身也是用Rust编写的，我们这里主要 关注使用Rust来编写Solana智能合约。

### Transactions
Transaction是由客户端向Solana节点发起请求的单元，一个Transactions可能包含有多个Instruction。Solana 节点在收到一个客户端发起的Transaction后，会先解析里面的每个Instruction,然后根据Instruction里面的 program_id字段，来调用对应的智能合约，并将Instruction传递给该智能合约。

### Instruction
Instruction是智能合约处理的基本单元:

整体流程是DApp客户端将自定义的指令数据序列化 到data里面，然后将账号信息和data发到链上，Solana节点为其找到要执行的程序，并将账号信息和数据data 传递给合约程序，合约程序里面将这个data数据在反序列化，得到客户端传过来的具体参数。

### Account
Solana链上的资源包括了内存、文件、CPU(Compute Budge)等，不同于EOS的内存和CPU，Solana上只是对合约 运行的的栈大小(4KB),CPU执行时间（200,000 BPF），函数栈深度（64）做了最大数量的约定，所以不会出现 EOS上的抢资源的情况。

Solana链上的信息，不同于EOS上的记录在内存，而是记录在文件中，这个文件在Solana上 表现为Account(PS:个人认为这个概念不是很好，容易和账户冲突，但是这个设计思想是OK的，类似Unix世界里面 的：一切皆是文件)，所以用户所需要支付的就是一个文件存储所需要的花费，是以SOL计价的。这里衍生出一个概念， 如果想要关闭文件的话，那么只要把这个Account的SOL都转走，那么这个Account对应的地址，在链上就没有钱 来买位置了，也就会被删除掉

### Runtime
Solana的Runtime前面说了，是执行BPF字节码的，为什么选择了这个runtime而不是WebAssembly或者Lua、Python 之类呢？其实主要还是因为性能的考量，Solana引以为傲的就是TPS，而BPF的执行效率更快。为了限制一个合约不至于 占光所有资源，runtime对合约的运行做了一些限制，当前的限制可以在SDK中查询：
```rust
pub struct BpfComputeBudget {
    /// Number of compute units that an instruction is allowed.  Compute units
    /// are consumed by program execution, resources they use, etc...
    pub max_units: u64,
    /// Number of compute units consumed by a log call
    pub log_units: u64,
    /// Number of compute units consumed by a log_u64 call
    pub log_64_units: u64,
    /// Number of compute units consumed by a create_program_address call
    pub create_program_address_units: u64,
    /// Number of compute units consumed by an invoke call (not including the cost incurred by
    /// the called program)
    pub invoke_units: u64,
    /// Maximum cross-program invocation depth allowed including the original caller
    pub max_invoke_depth: usize,
    /// Base number of compute units consumed to call SHA256
    pub sha256_base_cost: u64,
    /// Incremental number of units consumed by SHA256 (based on bytes)
    pub sha256_byte_cost: u64,
    /// Maximum BPF to BPF call depth
    pub max_call_depth: usize,
    /// Size of a stack frame in bytes, must match the size specified in the LLVM BPF backend
    pub stack_frame_size: usize,
    /// Number of compute units consumed by logging a `Pubkey`
    pub log_pubkey_units: u64,
}
```

当执行超过限制时，该条合约执行就会失败。

## 关键数据结构
为了方便合约的书写，Solana官方提供了C和Rust的SDK，对于Rust来说，只要在工程中添加

```rust
solana-program = "1.4.8"
```

既可以添加SDK的依赖，这里的版本号可以自行选择。而SDK的相关代码在 

[solana/sdk/program](https://github.com/solana-labs/solana/tree/master/sdk/program)

### 1. Pubkey
```rust
#[repr(transparent)]
#[derive(
    Serialize, Deserialize, Clone, Copy, Default, Eq, PartialEq, Ord, PartialOrd, Hash, AbiExample,
)]
pub struct Pubkey([u8; 32]);]
```

Pubkey实际是就是32个字符表示的额base58的Account地址，在上面的Instruction中，我们看到的ProgramId 就是这样的类型，因为Program本身其实一个文件，也就是Account，只是是可执行的文件。

### 2. AccountInfo
```rust
/// Account information
#[derive(Clone)]
pub struct AccountInfo<'a> {
    /// Public key of the account
    pub key: &'a Pubkey,
    /// Was the transaction signed by this account's public key?
    pub is_signer: bool,
    /// Is the account writable?
    pub is_writable: bool,
    /// The lamports in the account.  Modifiable by programs.
    pub lamports: Rc<RefCell<&'a mut u64>>,
    /// The data held in this account.  Modifiable by programs.
    pub data: Rc<RefCell<&'a mut [u8]>>,
    /// Program that owns this account
    pub owner: &'a Pubkey,
    /// This account's data contains a loaded program (and is now read-only)
    pub executable: bool,
    /// The epoch at which this account will next owe rent
    pub rent_epoch: Epoch,
}
```

AccountInfo就是一个Account在链上的表达形式，可以认为是一个文件的属性，想象一些state函数列出 的文件属性。其中，key表示文件名，也就是base58的地址。而文件大小可以认为是lamports，这里区别 与我们操作系统里面的文件，操作系统里面的文件的大小是可以为0的，且文件存在，而Solana链上的Account 如果其大小，也就是lamports为0的话，就认为这个文件被删除了（PS:这里将lamporsts类比作文件大小 是不完全准确的，因为文件大小是data字段内容的大小，但是从花费硬盘资源的角度，确实比较类似）。 这里的”is_writable”表示文件是否可执行，如果是可执行的，那么就是一个智能合约账号。 而data里面则是文件的内容，类似电脑上的ls 列出的文件属性，和cat列出来的文件内容，这里是二进制的

```
Rc<RefCell<&'a mut [u8]>>
```

buffer来表示。每个文件都要由一个程序来创建，这个程序称之为这个文件的拥有者，也就是这里的owner。

### 3. ProgramResult
```rust
/// Reasons the program may fail
#[derive(Clone, Debug, Deserialize, Eq, Error, PartialEq, Serialize)]
pub enum ProgramError {
    /// Allows on-chain programs to implement program-specific error types and see them returned
    /// by the Solana runtime. A program-specific error may be any type that is represented as
    /// or serialized to a u32 integer.
    #[error("Custom program error: {0:#x}")]
    Custom(u32)
    ...
}
use std::{
    result::Result as ResultGeneric,
};
pub type ProgramResult = ResultGeneric<(), ProgramError>;
```

ProgramResult实际上类型为ProgramError的Result对象，而ProgramError是Solana自定义的一个Error的 枚举，也就是Solana抛出来的错误枚举。在合约中，当正常逻辑执行结束后，我们通过Ok()来返回这里Reuslt 正确的结果，如果出错了，则通过这里的Result中的ProgramError错误返回。

### 4. AccountMeta
```rust
/// Account metadata used to define Instructions
#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct AccountMeta {
    /// An account's public key
    pub pubkey: Pubkey,
    /// True if an Instruction requires a Transaction signature matching `pubkey`.
    pub is_signer: bool,
    /// True if the `pubkey` can be loaded as a read-write account.
    pub is_writable: bool,
}
```
AccountMeta主要用于Instruction结构的定义，用于协助传递这个指令需要的其他账号信息，其中包括了账号的 地址，这个账号是否为签名账号，以及这个账号对应的内容(AccountInfo)是否可以修改。

### 5. Instruction
```rust
#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct Instruction {
    /// Pubkey of the instruction processor that executes this instruction
    pub program_id: Pubkey,
    /// Metadata for what accounts should be passed to the instruction processor
    pub accounts: Vec<AccountMeta>,
    /// Opaque data passed to the instruction processor
    pub data: Vec<u8>,
}
```

Instruction在上面已经有介绍了，一个处理指令，包含了要处理他的程序的地址program_id,以及这个程序处理 时需要用到的AccountMeta表示的账号信息，还有这个指令对应的具体数据payload部分的data。

这里真实的用户协议数据是序列化后，存放在data里面的，所以整体流程是DApp客户端将自定义的指令数据序列化 到data里面，然后将账号信息和data发到链上，Solana节点为其找到要执行的程序，并将账号信息和数据data 传递给合约程序，合约程序里面将这个data数据在反序列化，得到客户端传过来的具体参数。
